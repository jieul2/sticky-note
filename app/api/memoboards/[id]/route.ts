import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// 보드 수정 (이름 변경 및 색상 변경)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // params를 Promise 타입으로 정의
) {
  const { title, background } = await req.json();
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  // Next.js 15 필수 사항: params를 await하여 id를 가져옵니다.
  const { id } = await params;

  if (!userId) return NextResponse.json({ message: "로그인 필요" }, { status: 401 });

  try {
    const updatedBoard = await prisma.memoBoard.update({
      where: { 
        id: Number(id), // 언래핑된 id 사용
        userId: Number(userId) 
      },
      data: { 
        ...(title && { title }),
        ...(background && { background })
      },
    });
    return NextResponse.json(updatedBoard);
  } catch (error) {
    console.error("수정 에러:", error);
    return NextResponse.json({ message: "수정 실패" }, { status: 500 });
  }
}

// 보드 삭제
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // params를 Promise 타입으로 정의
) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  // Next.js 15 필수 사항: params를 await하여 id를 가져옵니다.
  const { id } = await params;

  if (!userId) return NextResponse.json({ message: "로그인 필요" }, { status: 401 });

  try {
    await prisma.memoBoard.delete({
      where: { 
        id: Number(id), // 언래핑된 id 사용
        userId: Number(userId)
      },
    });
    return NextResponse.json({ message: "삭제 성공" });
  } catch (error) {
    console.error("삭제 에러:", error);
    return NextResponse.json({ message: "삭제 실패" }, { status: 500 });
  }
}