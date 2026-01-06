import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const userId = Number(cookieStore.get("userId")?.value);

    if (!userId) {
      return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    const params = await props.params;
    const memoId = Number(params.id);

    // 숫자가 아니면 에러 반환 (위의 $%7Bid%7D 같은 오타 방지)
    if (isNaN(memoId)) {
      return NextResponse.json({ message: "유효하지 않은 메모 ID입니다." }, { status: 400 });
    }

    // 💡 Prisma 문법 수정: findUnique 내부 구조 확인
    const memo = await prisma.memo.findUnique({
      where: { 
        id: memoId 
      },
      include: { 
        board: true 
      },
    });

    if (!memo || memo.board.userId !== userId) {
      return NextResponse.json({ message: "삭제 권한이 없거나 메모를 찾을 수 없습니다." }, { status: 403 });
    }

    // 삭제 실행
    await prisma.memo.delete({
      where: { 
        id: memoId 
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("삭제 API 내부 에러:", error);
    return NextResponse.json({ message: "서버 에러가 발생했습니다." }, { status: 500 });
  }
}