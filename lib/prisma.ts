import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// PrismaClient 싱글톤 인스턴스
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient();

// 개발 환경에서는 글로벌로 유지 (Hot reload 방지)
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
