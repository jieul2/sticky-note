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

    // [추가] 가입 시 유저에게 부여할 랜덤 컬러 후보군
    // 사용자가 직접 정하지 않을 경우를 대비해 초기 컬러를 랜덤으로 지정하면 더 예쁩니다.
    const profileColors = [
      '#facc15', // Yellow
      '#f87171', // Red
      '#60a5fa', // Blue
      '#4ade80', // Green
      '#a78bfa', // Purple
      '#fb923c', // Orange
    ];
    const randomColor = profileColors[Math.floor(Math.random() * profileColors.length)];

    // 4. 유저 생성 (color 필드 포함)
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0], // 이름이 없으면 이메일 앞자리 사용
        color: randomColor, // 새로 추가된 color 필드에 값 할당
      },
    });

    return NextResponse.json(
      { message: '회원가입 성공' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}