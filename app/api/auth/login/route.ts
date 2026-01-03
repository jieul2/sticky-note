import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';


export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },

    });

    if (!user) {
      return NextResponse.json(
        { message: '존재하지 않는 사용자입니다.' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);


    if (!isValid) {
      return NextResponse.json(
        { message: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    const res = NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    res.cookies.set('userId', String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return NextResponse.json(
      { message: '서버 오류' },
      { status: 500 }
    );
  }
}
