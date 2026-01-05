import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  context: { params: Promise<{ boardId: string }> }
) {
  // 🍪 쿠키
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get("userId")?.value);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // ✅ Next.js 15 방식
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

  // 📝 메모 불러오기
  const memos = await prisma.memo.findMany({
    where: { boardId: boardIdNumber },
    orderBy: { modifiedAt: "desc" },
  });

  return NextResponse.json(memos);
}
