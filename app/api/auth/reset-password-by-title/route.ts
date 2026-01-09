import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, boardTitle, newPassword } = await request.json();

    // 1. 이메일로 사용자 조회 (보드 목록 포함)
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        memoBoards: {
          where: { title: boardTitle }
        }
      }
    });

    // 2. 사용자 존재 여부 및 보드 제목 일치 여부 확인
    if (!user) {
      return NextResponse.json(
        { message: '입력하신 정보와 일치하는 계정이 없습니다.' },
        { status: 404 }
      );
    }

    if (user.memoBoards.length === 0) {
      return NextResponse.json(
        { message: '보드 제목이 일치하지 않습니다.' },
        { status: 403 }
      );
    }

    // 3. 새 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. 비밀번호 업데이트
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });

  } catch (error) {
    console.error('Reset Password Error:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}