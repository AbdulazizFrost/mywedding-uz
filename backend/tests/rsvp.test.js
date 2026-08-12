import request from 'supertest';
import { jest } from '@jest/globals';

process.env.NODE_ENV = 'development';

jest.unstable_mockModule('../src/config/database.js', () => {
  return {
    prisma: {
      invitation: {
        findUnique: jest.fn(),
      },
      rsvpResponse: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
      session: {
        findUnique: jest.fn(),
      },
    }
  };
});

jest.unstable_mockModule('express-rate-limit', () => ({
  default: () => (req, res, next) => next()
}));

const { createApp } = await import('../src/app.js');
const { prisma } = await import('../src/config/database.js');

const app = createApp();

const validSession = {
  refresh_token: 'valid_token',
  expires_at: new Date(Date.now() + 100000),
  user: { id: 'user-123', email: 'test@example.com', role: 'user' },
};

describe('RSVP API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/public/invitations/:slug/rsvp', () => {
    const validRsvpData = {
      guest_name: 'John Doe',
      status: 'attending',
      guest_count: 2,
      comment: 'Looking forward to it!'
    };

    it('1. Published invitation with RSVP enabled -> success', async () => {
      prisma.invitation.findUnique.mockResolvedValue({
        id: 'inv-1',
        status: 'published',
        data: JSON.stringify({ rsvp: { enabled: true } })
      });
      prisma.rsvpResponse.create.mockResolvedValue({});

      const response = await request(app)
        .post('/api/public/invitations/my-slug/rsvp')
        .send(validRsvpData);

      expect(response.status).toBe(201);
      expect(prisma.rsvpResponse.create).toHaveBeenCalledWith({
        data: {
          invitation_id: 'inv-1',
          guest_name: 'John Doe',
          attending: true,
          guests_count: 2,
          message: 'Looking forward to it!'
        }
      });
    });

    it('2. Draft invitation -> 404', async () => {
      prisma.invitation.findUnique.mockResolvedValue({
        id: 'inv-1',
        status: 'draft',
        data: JSON.stringify({ rsvp: { enabled: true } })
      });

      const response = await request(app)
        .post('/api/public/invitations/my-slug/rsvp')
        .send(validRsvpData);

      expect(response.status).toBe(404);
    });

    it('3. RSVP disabled -> reject', async () => {
      prisma.invitation.findUnique.mockResolvedValue({
        id: 'inv-1',
        status: 'published',
        data: JSON.stringify({ rsvp: { enabled: false } })
      });

      const response = await request(app)
        .post('/api/public/invitations/my-slug/rsvp')
        .send(validRsvpData);

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('RSVP отключено');
    });

    it('4. Invalid guest_name', async () => {
      const response = await request(app)
        .post('/api/public/invitations/my-slug/rsvp')
        .send({ ...validRsvpData, guest_name: 'A' });
      expect(response.status).toBe(400);
    });

    it('5. Invalid status', async () => {
      const response = await request(app)
        .post('/api/public/invitations/my-slug/rsvp')
        .send({ ...validRsvpData, status: 'maybe' });
      expect(response.status).toBe(400);
    });

    it('6. Invalid guest_count', async () => {
      const response = await request(app)
        .post('/api/public/invitations/my-slug/rsvp')
        .send({ ...validRsvpData, guest_count: 25 });
      expect(response.status).toBe(400);
    });

    it('7. Not attending mapping', async () => {
      prisma.invitation.findUnique.mockResolvedValue({
        id: 'inv-1',
        status: 'published',
        data: { rsvp: { enabled: true } }
      });
      prisma.rsvpResponse.create.mockResolvedValue({});

      const response = await request(app)
        .post('/api/public/invitations/my-slug/rsvp')
        .send({ guest_name: 'Jane', status: 'not_attending', guest_count: 2 });

      expect(response.status).toBe(201);
      expect(prisma.rsvpResponse.create).toHaveBeenCalledWith({
        data: {
          invitation_id: 'inv-1',
          guest_name: 'Jane',
          attending: false,
          guests_count: 0,
          message: null
        }
      });
    });
  });

  describe('GET /api/invitations/:id/rsvp', () => {
    it('8. User can get RSVPs of their invitation', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.invitation.findUnique.mockResolvedValue({ id: 'inv-1', user_id: 'user-123' });
      prisma.rsvpResponse.findMany.mockResolvedValue([{ id: 'rsvp-1' }]);

      const response = await request(app)
        .get('/api/invitations/inv-1/rsvp')
        .set('Cookie', 'sessionId=valid_token');

      expect(response.status).toBe(200);
      expect(response.body.rsvps).toHaveLength(1);
    });

    it('9. User cannot get RSVPs of someone else', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.invitation.findUnique.mockResolvedValue({ id: 'inv-1', user_id: 'another-user' });

      const response = await request(app)
        .get('/api/invitations/inv-1/rsvp')
        .set('Cookie', 'sessionId=valid_token');

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/invitations/:id/rsvp/:responseId', () => {
    it('10. User can delete their RSVP', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.invitation.findUnique.mockResolvedValue({ id: 'inv-1', user_id: 'user-123' });
      prisma.rsvpResponse.findUnique.mockResolvedValue({ id: 'rsvp-1', invitation_id: 'inv-1' });

      const response = await request(app)
        .delete('/api/invitations/inv-1/rsvp/rsvp-1')
        .set('Cookie', 'sessionId=valid_token');

      expect(response.status).toBe(200);
      expect(prisma.rsvpResponse.delete).toHaveBeenCalledWith({ where: { id: 'rsvp-1' } });
    });

    it('11. User cannot delete RSVP of someone else', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.invitation.findUnique.mockResolvedValue({ id: 'inv-1', user_id: 'another-user' });

      const response = await request(app)
        .delete('/api/invitations/inv-1/rsvp/rsvp-1')
        .set('Cookie', 'sessionId=valid_token');

      expect(response.status).toBe(404);
    });
  });
});
