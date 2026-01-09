import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; //
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    // 로그인 시 저장한 'userId' 쿠키를 확인합니다
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json(
        { message: '인증되지 않음 (로그인이 필요합니다)' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        email: true,
        name: true,
        color: true, // [필수] 마이페이지와 헤더에서 사용할 컬러 필드입니다
        createdAt: true,
        _count: {
          select: { memoBoards: true }
        },
        memoBoards: {
          take: 6,
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            title: true,
            background: true,
            updatedAt: true,
            _count: {
              select: { memos: true }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: '사용자를 찾을 수 없음' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Me API Error:", error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}