import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// 전달받는 메모 데이터의 타입을 정의합니다.
interface MemoUpdateInput {
  id: number;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontColor: string;
  fontWeight: string;
  fontFamily: string;
  backgroundColor: string;
  borderWidth: number;
  borderColor: string | null; // 프론트에서 null이 올 수 있음을 명시
  overflow: string;
}

/* =========================
   GET : 메모 불러오기
========================= */
export async function GET(
  req: Request,
  context: { params: Promise<{ boardId: string }> }
) {
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get("userId")?.value);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { boardId } = await context.params;
  const boardIdNumber = Number(boardId);

  if (Number.isNaN(boardIdNumber)) {
    return NextResponse.json({ message: "Invalid boardId" }, { status: 400 });
  }

  // 🔐 보드 소유권 확인
  const board = await prisma.memoBoard.findFirst({
    where: {
      id: boardIdNumber,
      userId: userId,
    },
  });

  if (!board) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const memos = await prisma.memo.findMany({
    where: { boardId: boardIdNumber },
    orderBy: { modifiedAt: "desc" },
  });

  return NextResponse.json(memos);
}

/* =========================
   PUT : 메모 저장 (보드 단위)
========================= */
export async function PUT(
  req: Request,
  context: { params: Promise<{ boardId: string }> }
) {
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get("userId")?.value);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { boardId } = await context.params;
  const boardIdNumber = Number(boardId);

  if (Number.isNaN(boardIdNumber)) {
    return NextResponse.json({ message: "Invalid boardId" }, { status: 400 });
  }

  // 🔐 보드 소유권 확인
  const board = await prisma.memoBoard.findFirst({
    where: {
      id: boardIdNumber,
      userId: userId,
    },
  });

  if (!board) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { memos } = await req.json();

  if (!Array.isArray(memos)) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  // 📝 메모 업데이트
  await Promise.all(
    memos.map((memo: MemoUpdateInput) =>
      prisma.memo.update({
        where: {
          id: memo.id,
          boardId: boardIdNumber,
        },
        data: {
          content: memo.content,
          x: memo.x,
          y: memo.y,
          width: memo.width,
          height: memo.height,
          fontSize: memo.fontSize,
          fontColor: memo.fontColor,
          fontWeight: memo.fontWeight,
          fontFamily: memo.fontFamily,
          backgroundColor: memo.backgroundColor,
          borderWidth: memo.borderWidth,
          // borderColor가 null인 경우 빈 문자열("") 또는 기본 컬러("#000000")를 할당하여 에러 방지
          borderColor: memo.borderColor ?? "#000000",
          overflow: memo.overflow,
        },
      })
    )
  );

  return NextResponse.json({ success: true });
}