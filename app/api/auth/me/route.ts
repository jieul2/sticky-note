import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies(); // ✅ await 필수
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    return NextResponse.json(
      { message: '로그인 안 됨' },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  return NextResponse.json(user);
}
