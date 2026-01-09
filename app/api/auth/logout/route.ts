import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: '로그아웃 완료' });
  
  // 보안을 위해 모든 인증 관련 쿠키를 명시적으로 삭제합니다.
  const cookieOptions = { path: '/', maxAge: 0, httpOnly: true, sameSite: 'lax' as const };
  
  res.cookies.set('userId', '', cookieOptions);
  res.cookies.set('auth_token', '', cookieOptions);
  
  return res;
}

export async function GET() {
  return NextResponse.json({ message: 'POST 요청으로만 로그아웃 가능합니다.' }, { status: 405 });
}