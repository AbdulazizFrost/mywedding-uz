import request from 'supertest';
import { jest } from '@jest/globals';

process.env.NODE_ENV = 'development';

jest.unstable_mockModule('../src/config/database.js', () => {
  const prismaMock = {
    order: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    payment: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    paymentEvent: {
      create: jest.fn(),
    },
    invitation: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    session: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn().mockImplementation(async (callback) => {
      return callback(prismaMock);
    }),
  };
  return { prisma: prismaMock };
});

const { createApp } = await import('../src/app.js');
const { prisma } = await import('../src/config/database.js');

const app = createApp();

const validSession = {
  refresh_token: 'valid_token',
  expires_at: new Date(Date.now() + 100000),
  user: { id: 'user-123', email: 'test@example.com', role: 'user' },
};

describe('Payments API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/payments', () => {
    it('1. Cannot create payment without authentication', async () => {
      const response = await request(app).post('/api/payments').send({ order_id: '123' });
      expect(response.status).toBe(401);
    });

    it('2. Cannot create payment for another users order', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.order.findUnique.mockResolvedValue({ id: 'order-1', user_id: 'another-user' });

      const response = await request(app)
        .post('/api/payments')
        .set('Cookie', 'sessionId=valid_token')
        .send({ order_id: 'order-1' });

      expect(response.status).toBe(404);
    });

    it('3. Cannot create payment for paid order', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.order.findUnique.mockResolvedValue({ id: 'order-1', user_id: 'user-123', status: 'paid' });

      const response = await request(app)
        .post('/api/payments')
        .set('Cookie', 'sessionId=valid_token')
        .send({ order_id: 'order-1' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('not pending');
    });

    it('4 & 5. Payment is created with amount from Order (amount from frontend is ignored)', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.order.findUnique.mockResolvedValue({ 
        id: 'order-1', user_id: 'user-123', status: 'pending', amount: 1000, currency: 'UZS' 
      });
      prisma.payment.findFirst.mockResolvedValue(null);
      prisma.payment.create.mockResolvedValue({ id: 'payment-1' });
      prisma.payment.update.mockResolvedValue({ id: 'payment-1', status: 'pending' });

      const response = await request(app)
        .post('/api/payments')
        .set('Cookie', 'sessionId=valid_token')
        .send({ order_id: 'order-1', amount: 1 }); // Fake amount

      expect(response.status).toBe(201);
      
      const createCall = prisma.payment.create.mock.calls[0][0];
      expect(createCall.data.amount).toBe(1000); // Amount from DB
      expect(createCall.data.order_id).toBe('order-1');
    });

    it('6. Repeated payment request for same order returns existing pending payment', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.order.findUnique.mockResolvedValue({ id: 'order-1', user_id: 'user-123', status: 'pending' });
      prisma.payment.findFirst.mockResolvedValue({ id: 'payment-existing', status: 'pending' });

      const response = await request(app)
        .post('/api/payments')
        .set('Cookie', 'sessionId=valid_token')
        .send({ order_id: 'order-1' });

      expect(response.status).toBe(200);
      expect(response.body.payment.id).toBe('payment-existing');
      expect(prisma.payment.create).not.toHaveBeenCalled();
    });
  });

  describe('Dev Mock Success (POST /api/dev/payments/:id/success)', () => {
    it('7, 8, 9, 12. Mock success transitions payment->success, order->paid, creates invitation, creates event', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1', order_id: 'order-1', status: 'pending',
        order: { id: 'order-1', user_id: 'user-123', status: 'pending' }
      });

      prisma.order.findUnique.mockResolvedValue({
        id: 'order-1', user_id: 'user-123', status: 'pending', template: { id: 't1', slug: 't1', schema: {} }
      });
      
      prisma.payment.update.mockResolvedValue({ id: 'payment-1', status: 'success' });
      prisma.order.update.mockResolvedValue({ id: 'order-1', status: 'paid' });
      prisma.invitation.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      prisma.invitation.create.mockResolvedValue({ id: 'invitation-1' });

      const response = await request(app)
        .post('/api/dev/payments/payment-1/success')
        .set('Cookie', 'sessionId=valid_token');

      expect(response.status).toBe(200);
      expect(response.body.payment.status).toBe('success');
      expect(response.body.order.status).toBe('paid');
      expect(response.body.invitation.id).toBe('invitation-1');
      expect(prisma.paymentEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ event_type: 'payment.success' }) })
      );
    });

    it('10. Repeated success attempt fails (order not pending)', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      
      // Suppose order is already paid
      prisma.payment.findUnique.mockResolvedValue({
        id: 'payment-1', order_id: 'order-1', status: 'success',
        order: { id: 'order-1', user_id: 'user-123', status: 'paid' }
      });

      const response = await request(app)
        .post('/api/dev/payments/payment-1/success')
        .set('Cookie', 'sessionId=valid_token');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('already processed');
      expect(prisma.payment.update).not.toHaveBeenCalled();
    });

    it('13. Dev success endpoint fails if NODE_ENV is not development', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      prisma.session.findUnique.mockResolvedValue(validSession);

      const response = await request(app)
        .post('/api/dev/payments/payment-1/success')
        .set('Cookie', 'sessionId=valid_token');

      expect(response.status).toBe(403);
      
      // Restore
      process.env.NODE_ENV = originalEnv;
    });
  });
});
