import { prisma } from '@/lib/prisma';

async function main() {
  // 새 유저 생성
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: '1234',
      name: '다훈',
    },
  });
  console.log('Created user:', user);

  // 유저 조회
  const users = await prisma.user.findMany();
  console.log('All users:', users);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
