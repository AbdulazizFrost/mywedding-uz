import request from 'supertest';
import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/config/database.js', () => ({
  prisma: {
    template: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

const { createApp } = await import('../src/app.js');
const { prisma } = await import('../src/config/database.js');

const app = createApp();

describe('Templates API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/templates', () => {
    it('should return a list of active templates', async () => {
      prisma.template.findMany.mockResolvedValue([
        { id: '1', name: 'T1', slug: 't1', is_active: true },
        { id: '2', name: 'T2', slug: 't2', is_active: true },
      ]);

      const response = await request(app).get('/api/templates');

      expect(response.status).toBe(200);
      expect(response.body.templates.length).toBe(2);
      expect(prisma.template.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { is_active: true },
        })
      );
    });

    it('should support category filter', async () => {
      prisma.template.findMany.mockResolvedValue([]);
      
      await request(app).get('/api/templates?category=classic');

      expect(prisma.template.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: 'classic' }),
        })
      );
    });
  });

  describe('GET /api/templates/:slug', () => {
    it('should return a template if found and active', async () => {
      prisma.template.findFirst.mockResolvedValue({ id: '1', slug: 't1' });

      const response = await request(app).get('/api/templates/t1');

      expect(response.status).toBe(200);
      expect(response.body.template.id).toBe('1');
    });

    it('should return 404 if not found or inactive', async () => {
      prisma.template.findFirst.mockResolvedValue(null);

      const response = await request(app).get('/api/templates/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Template not found');
    });
  });
});
