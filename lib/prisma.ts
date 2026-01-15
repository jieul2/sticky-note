// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// 1. PostgreSQL 연결 풀 생성
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Prisma용 어댑터 생성
const adapter = new PrismaPg(pool);

// 3. 어댑터를 사용하여 PrismaClient 인스턴스화
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapter, // 🔥 datasourceUrl 대신 adapter를 사용합니다.
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;