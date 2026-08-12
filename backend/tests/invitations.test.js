import request from 'supertest';
import { jest } from '@jest/globals';

// Set NODE_ENV to development so the dev routes are mounted
process.env.NODE_ENV = 'development';

jest.unstable_mockModule('../src/config/database.js', () => {
  const prismaMock = {
    order: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    invitation: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    session: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn().mockImplementation(async (callback) => {
      // Execute the callback with the prisma mock acting as the transaction object
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

describe('Invitations & Dev API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });



  describe('Invitations API (PATCH)', () => {
    it('5. cannot change protected fields via PATCH', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.invitation.findUnique.mockResolvedValue({
        id: 'inv-1', user_id: 'user-123', data: {}
      });
      prisma.invitation.update.mockResolvedValue({});

      const response = await request(app)
        .patch('/api/invitations/inv-1')
        .set('Cookie', 'sessionId=valid_token')
        .send({
          data: { user_id: 'hacked', slug: 'hacked', groom_name: 'John' }
        });

      expect(response.status).toBe(200);
      const updateCall = prisma.invitation.update.mock.calls[0][0];
      expect(updateCall.data.data.groom_name).toBe('John');
      expect(updateCall.data.data.user_id).toBeUndefined(); // ensure it filtered it out
      expect(updateCall.data.data.slug).toBeUndefined();
    });

    it('6. cannot edit someone else\'s invitation', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.invitation.findUnique.mockResolvedValue({
        id: 'inv-1', user_id: 'another-user'
      });

      const response = await request(app)
        .patch('/api/invitations/inv-1')
        .set('Cookie', 'sessionId=valid_token')
        .send({ data: { groom_name: 'John' } });

      expect(response.status).toBe(404);
    });
  });

  describe('Publish Lifecycle', () => {
    it('7. publish requires mandatory fields', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.invitation.findUnique.mockResolvedValue({
        id: 'inv-1', user_id: 'user-123', data: { groom_name: 'John' } // missing others
      });

      const response = await request(app)
        .post('/api/invitations/inv-1/publish')
        .set('Cookie', 'sessionId=valid_token');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Missing required fields');
    });

    it('8. unpublish works', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.invitation.findUnique.mockResolvedValue({
        id: 'inv-1', user_id: 'user-123'
      });
      prisma.invitation.update.mockResolvedValue({ status: 'draft' });

      const response = await request(app)
        .post('/api/invitations/inv-1/unpublish')
        .set('Cookie', 'sessionId=valid_token');

      expect(response.status).toBe(200);
      expect(prisma.invitation.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'draft', published_at: null }) })
      );
    });
  });

  describe('Public API', () => {
    it('9. public endpoint hides private fields and shows published', async () => {
      prisma.invitation.findUnique.mockResolvedValue({
        id: 'inv-1', user_id: 'user-123', status: 'published', slug: 'my-slug', data: { groom_name: 'J' }
      });

      const response = await request(app).get('/api/public/invitations/my-slug');

      expect(response.status).toBe(200);
      expect(response.body.invitation.slug).toBe('my-slug');
      expect(response.body.invitation.data.groom_name).toBe('J');
      expect(response.body.invitation).not.toHaveProperty('user_id');
      expect(response.body.invitation).not.toHaveProperty('id');
    });

    it('10. draft invitation is not accessible publicly', async () => {
      prisma.invitation.findUnique.mockResolvedValue({
        id: 'inv-1', user_id: 'user-123', status: 'draft'
      });

      const response = await request(app).get('/api/public/invitations/my-slug');

      expect(response.status).toBe(404);
    });
  });
});
