// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: '로그아웃 완료' });
  res.cookies.set('userId', '', { path: '/', maxAge: 0, httpOnly: true, sameSite: 'lax' });
  return res;
}

// GET 요청으로 접근 시
export async function GET() {
  return NextResponse.json({ message: 'POST 요청으로만 로그아웃 가능합니다.' }, { status: 405 });
}
