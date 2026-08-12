import request from 'supertest';
import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/config/database.js', () => ({
  prisma: {
    template: {
      findUnique: jest.fn(),
    },
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    session: {
      findUnique: jest.fn(),
    },
  },
}));

const { createApp } = await import('../src/app.js');
const { prisma } = await import('../src/config/database.js');

const app = createApp();

const validSession = {
  refresh_token: 'valid_token',
  expires_at: new Date(Date.now() + 100000),
  user: { id: 'user-123', email: 'test@example.com', role: 'user' },
};

describe('Orders API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/orders', () => {
    it('should prevent unauthenticated access', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({ template_id: 't1' });
      expect(response.status).toBe(401);
    });

    it('should fail if template is inactive', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.template.findUnique.mockResolvedValue({ id: 't1', is_active: false });

      const response = await request(app)
        .post('/api/orders')
        .set('Cookie', 'sessionId=valid_token')
        .send({ template_id: 't1' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Template not found or inactive');
    });

    it('should create order using template price, ignoring provided amount', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.template.findUnique.mockResolvedValue({ id: 't1', is_active: true, price: 150000, currency: 'UZS' });
      prisma.order.create.mockResolvedValue({ id: 'order-1', amount: 150000 });

      const response = await request(app)
        .post('/api/orders')
        .set('Cookie', 'sessionId=valid_token')
        .send({ template_id: 't1', amount: 1 }); // Fake amount

      expect(response.status).toBe(201);
      
      // Ensure the amount passed to prisma.order.create was 150000, not 1
      expect(prisma.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            amount: 150000,
            status: 'pending',
            user_id: 'user-123',
          })
        })
      );
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should prevent user from seeing anothers order', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      // Mock returns an order that belongs to another user
      prisma.order.findUnique.mockResolvedValue({ id: 'order-1', user_id: 'another-user-456' });

      const response = await request(app)
        .get('/api/orders/order-1')
        .set('Cookie', 'sessionId=valid_token');

      // Returns 404 to avoid leaking existence
      expect(response.status).toBe(404);
    });
  });
});
