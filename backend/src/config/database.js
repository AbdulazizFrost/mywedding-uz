import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.databaseUrl,
    },
  },
});

export async function testDatabaseConnection() {
  if (!env.databaseUrl) {
    console.warn('[database] DATABASE_URL не задан — подключение к БД пропущено.');
    return false;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('[database] Подключение к PostgreSQL (через Prisma) успешно.');
    return true;
  } catch (error) {
    console.warn('[database] Не удалось подключиться к PostgreSQL:', error.message);
    return false;
  }
}
