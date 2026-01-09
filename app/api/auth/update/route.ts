import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

// 업데이트 데이터 객체를 위한 타입 정의
interface UpdateData {
  name?: string;
  color?: string;
  password?: string;
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { name, color, currentPassword, newPassword } = await req.json();

    // 1. 유저 확인
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return NextResponse.json(
        { message: '유저를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const updateData: UpdateData = {};

    // 2. 이름 및 컬러 변경 확인
    if (name && name.trim() !== "") {
      updateData.name = name;
    }
    
    if (color) {
      updateData.color = color;
    }

    // 3. 비밀번호 변경 로직 (현재 비밀번호와 새 비밀번호가 모두 있을 때만 실행)
    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: '현재 비밀번호가 일치하지 않습니다.' },
          { status: 400 }
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { message: '새 비밀번호는 8자 이상이어야 합니다.' },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // 4. 변경사항이 없는 경우 체크
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: '변경할 내용이 없습니다.' },
        { status: 400 }
      );
    }

    // 5. DB 업데이트 실행
    await prisma.user.update({
      where: { id: Number(userId) },
      data: updateData,
    });

    return NextResponse.json({ message: '수정 성공' });
  } catch (error) {
    console.error('UPDATE ERROR:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}