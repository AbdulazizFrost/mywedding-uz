import request from 'supertest';
import { jest } from '@jest/globals';
import path from 'path';

process.env.NODE_ENV = 'development';

// We must mock the actual multer upload flow if we want to avoid testing disk writes,
// or we can test against the real local storage in an isolated environment.
// Since we are mocking Prisma, we should also mock LocalStorageProvider.
jest.unstable_mockModule('../src/modules/media/local.storage.js', () => {
  return {
    LocalStorageProvider: class {
      async upload(file) { return `uploads/test-${file.originalname}`; }
      async delete(storageKey) { return true; }
      getPublicUrl(storageKey) { return `http://localhost:5000/${storageKey}`; }
    }
  };
});

jest.unstable_mockModule('../src/config/database.js', () => {
  return {
    prisma: {
      invitation: {
        findUnique: jest.fn(),
      },
      media: {
        create: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
        findMany: jest.fn(),
      },
      session: {
        findUnique: jest.fn(),
      },
    }
  };
});

const { createApp } = await import('../src/app.js');
const { prisma } = await import('../src/config/database.js');

const app = createApp();

const validSession = {
  refresh_token: 'valid_token',
  expires_at: new Date(Date.now() + 100000),
  user: { id: 'user-123', email: 'test@example.com', role: 'user' },
};

describe('Media API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/invitations/:id/media', () => {
    it('1. Requires authentication', async () => {
      const response = await request(app).post('/api/invitations/inv-1/media');
      expect(response.status).toBe(401);
    });

    it('2. Checks invitation ownership', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.invitation.findUnique.mockResolvedValue({ id: 'inv-1', user_id: 'another-user' });

      const response = await request(app)
        .post('/api/invitations/inv-1/media')
        .set('Cookie', 'sessionId=valid_token')
        .attach('file', Buffer.from('fake image'), 'test.jpg');

      expect(response.status).toBe(404);
    });

    it('3. Rejects invalid MIME types', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.invitation.findUnique.mockResolvedValue({ id: 'inv-1', user_id: 'user-123' });

      const response = await request(app)
        .post('/api/invitations/inv-1/media')
        .set('Cookie', 'sessionId=valid_token')
        .attach('file', Buffer.from('fake file'), { filename: 'test.txt', contentType: 'text/plain' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid file type');
      expect(prisma.media.create).not.toHaveBeenCalled();
    });

    it('4. Accepts valid image and creates Media record', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.invitation.findUnique.mockResolvedValue({ id: 'inv-1', user_id: 'user-123' });
      prisma.media.create.mockResolvedValue({ id: 'media-1', url: 'http://localhost:5000/uploads/test-test.jpg' });

      const response = await request(app)
        .post('/api/invitations/inv-1/media')
        .set('Cookie', 'sessionId=valid_token')
        .attach('file', Buffer.from('fake image data'), { filename: 'test.jpg', contentType: 'image/jpeg' });

      expect(response.status).toBe(201);
      expect(response.body.media.url).toBe('http://localhost:5000/uploads/test-test.jpg');
      expect(prisma.media.create).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/invitations/:id/media/:mediaId', () => {
    it('5. Cannot delete media of another users invitation', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.invitation.findUnique.mockResolvedValue({ id: 'inv-1', user_id: 'another-user' });

      const response = await request(app)
        .delete('/api/invitations/inv-1/media/media-1')
        .set('Cookie', 'sessionId=valid_token');

      expect(response.status).toBe(404);
    });

    it('6. Cannot delete media that belongs to different invitation', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.invitation.findUnique.mockResolvedValue({ id: 'inv-1', user_id: 'user-123' });
      prisma.media.findUnique.mockResolvedValue({ id: 'media-1', invitation_id: 'inv-2' });

      const response = await request(app)
        .delete('/api/invitations/inv-1/media/media-1')
        .set('Cookie', 'sessionId=valid_token');

      expect(response.status).toBe(404);
      expect(prisma.media.delete).not.toHaveBeenCalled();
    });

    it('7. Deletes media successfully', async () => {
      prisma.session.findUnique.mockResolvedValue(validSession);
      prisma.invitation.findUnique.mockResolvedValue({ id: 'inv-1', user_id: 'user-123' });
      prisma.media.findUnique.mockResolvedValue({ id: 'media-1', invitation_id: 'inv-1', storage_key: 'uploads/test.jpg' });

      const response = await request(app)
        .delete('/api/invitations/inv-1/media/media-1')
        .set('Cookie', 'sessionId=valid_token');

      expect(response.status).toBe(200);
      expect(prisma.media.delete).toHaveBeenCalledWith({ where: { id: 'media-1' } });
    });
  });
});
