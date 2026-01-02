import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // 1. 입력값 검증
    if (!email || !password) {
      return NextResponse.json(
        { message: '이메일과 비밀번호는 필수입니다.' },
        { status: 400 }
      );
    }

    // 2. 이미 존재하는 유저 체크
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: '이미 가입된 이메일입니다.' },
        { status: 409 }
      );
    }

    // 3. 비밀번호 해시
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. 유저 생성
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return NextResponse.json(
      { message: '회원가입 성공' },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: '서버 오류' },
      { status: 500 }
    );
  }
}
