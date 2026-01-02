import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// 1. 환경 변수에서 URL 가져오기
const connectionString = process.env.DATABASE_URL;

// 환경 변수가 없으면 에러 발생 (보안상 개발자에게 바로 알림)
if (!connectionString) {
  throw new Error("DATABASE_URL 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.");
}

// 2. URL 파싱
const url = new URL(connectionString);

// 3. Prisma 어댑터 생성
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1), // '/' 제거
  connectionLimit: 5,
});

// 4. 어댑터를 사용하여 PrismaClient 초기화
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

// 개발 환경에서는 글로벌로 PrismaClient 유지 (Hot reload 방지)
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
