import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// 1. 전달받는 메모 데이터 타입에 textAlign, verticalAlign 추가
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
  borderColor: string | null;
  overflow: string;
  textAlign: string;      // 추가
  verticalAlign: string;  // 추가
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
   POST : 새 메모 생성
========================= */
export async function POST(
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

  const board = await prisma.memoBoard.findFirst({
    where: {
      id: boardIdNumber,
      userId: userId,
    },
  });

  if (!board) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await req.json();

    // 2. DB에 새 메모 생성 시 정렬 기본값 설정
    const newMemo = await prisma.memo.create({
      data: {
        boardId: boardIdNumber,
        content: data.content || "",
        x: data.x,
        y: data.y,
        width: data.width || 250,
        height: data.height || 200,
        fontSize: data.fontSize || 16,
        fontColor: data.fontColor || "#18181b",
        fontWeight: data.fontWeight || "normal",
        fontFamily: data.fontFamily || "inherit",
        backgroundColor: data.backgroundColor || "#ffffff",
        borderWidth: data.borderWidth || 1,
        borderColor: data.borderColor || "#e5e7eb",
        overflow: data.overflow || "hidden",
        textAlign: data.textAlign || "left",       // 추가
        verticalAlign: data.verticalAlign || "top", // 추가
      },
    });

    return NextResponse.json(newMemo);
  } catch (error) {
    console.error("메모 생성 실패:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
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

  // 3. 메모 업데이트 시 정렬 데이터 반영
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
          borderColor: memo.borderColor ?? "#e5e7eb",
          overflow: memo.overflow,
          textAlign: memo.textAlign,       // 추가
          verticalAlign: memo.verticalAlign, // 추가
        },
      })
    )
  );

  return NextResponse.json({ success: true });
}