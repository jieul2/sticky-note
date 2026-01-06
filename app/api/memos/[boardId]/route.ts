import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

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
    memos.map((memo: { id: number; content: string }) =>
      prisma.memo.update({
        where: {
          id: memo.id,
          boardId: boardIdNumber, // 안전장치
        },
        data: {
          content: memo.content,
        },
      })
    )
  );

  return NextResponse.json({ success: true });
}
