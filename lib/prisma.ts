// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// 이미 글로벌에 prisma가 있으면 재사용, 없으면 새로 생성
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // 옵션, 필요 없으면 제거 가능
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
