// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
  var prisma: PrismaClient | undefined;
  var pgPool: Pool | undefined;
}

/**
 * PostgreSQL Pool
 * - Vercel / Serverless 환경에서 필수
 * - Supabase Pooler URL 사용 권장
 */
const pool =
  global.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : undefined,
    max: 10,               // 최대 커넥션 수 (안전)
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2_000,
  });

if (process.env.NODE_ENV !== 'production') {
  global.pgPool = pool;
}

/**
 * Prisma Adapter
 */
const adapter = new PrismaPg(pool);

/**
 * Prisma Client (Singleton)
 */
export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'warn', 'error']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
