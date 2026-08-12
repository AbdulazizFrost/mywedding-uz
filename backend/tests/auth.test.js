import request from 'supertest';
import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/config/database.js', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    session: {
      findUnique: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const { createApp } = await import('../src/app.js');
const { prisma } = await import('../src/config/database.js');
import bcrypt from 'bcrypt';


const app = createApp();

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'user',
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          full_name: 'Test User',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Registration successful');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user).not.toHaveProperty('password_hash');
    });

    it('should fail if email is already taken', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-123' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Email is already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully and set cookie', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        password_hash: hashedPassword,
        role: 'user',
      });
      prisma.session.create.mockResolvedValue({});

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('sessionId=');
    });

    it('should fail on wrong password', async () => {
      const hashedPassword = await bcrypt.hash('correct_password', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        password_hash: hashedPassword,
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrong_password',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid email or password');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should block unauthenticated access', async () => {
      const response = await request(app).get('/api/auth/me');
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized: No session token provided');
    });

    it('should allow authenticated access', async () => {
      prisma.session.findUnique.mockResolvedValue({
        refresh_token: 'valid_token',
        expires_at: new Date(Date.now() + 100000),
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'user',
        },
      });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', 'sessionId=valid_token');

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('test@example.com');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should clear cookie and delete session', async () => {
      prisma.session.findUnique.mockResolvedValue({
        refresh_token: 'valid_token',
        expires_at: new Date(Date.now() + 100000),
        user: { id: 'user-123' },
      });
      prisma.session.deleteMany.mockResolvedValue({});

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', 'sessionId=valid_token');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logout successful');
      expect(response.headers['set-cookie'][0]).toContain('sessionId=;');
    });
  });
});
