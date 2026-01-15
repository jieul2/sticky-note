// prisma.config.ts
import { defineConfig } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // env() 헬퍼 대신 process.env를 직접 사용하여 값을 확실히 주입합니다.
    url: process.env.DATABASE_URL,
  },
});