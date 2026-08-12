import request from 'supertest';
import { jest } from '@jest/globals';
import express from 'express';

// Force production environment
process.env.NODE_ENV = 'production';

// We import createApp dynamically after setting NODE_ENV
const { createApp } = await import('../src/app.js');
const app = createApp();

describe('Production Security Checks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Dev Endpoints in Production', () => {
    it('1. /api/dev/payments/:id/success should return 404 (disabled)', async () => {
      const response = await request(app).post('/api/dev/payments/123/success');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('2. /api/dev/orders/:id/activate should return 404 (disabled)', async () => {
      const response = await request(app).post('/api/dev/orders/123/activate');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Health Endpoint', () => {
    it('3. /api/health returns safe data', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('service', 'mywedding-api');
      
      // Should not leak secrets
      const bodyStr = JSON.stringify(response.body);
      expect(bodyStr).not.toContain('DATABASE_URL');
      expect(bodyStr).not.toContain('S3_SECRET');
    });
  });

  describe('Error Handling', () => {
    it('4. 500 error does not return stack trace in production', async () => {
      const { errorHandler } = await import('../src/middlewares/errorHandler.js');
      
      const err = new Error('Test Error');
      err.stack = 'Error: Test Error\n    at somewhere';
      err.status = 500;
      
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      
      errorHandler(err, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          message: 'Internal Server Error'
        }
      });
    });
  });
});
