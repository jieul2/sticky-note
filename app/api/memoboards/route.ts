// app/api/memoboards/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // 또는 import prisma from "@/lib/prisma"; (설정에 따라)
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ message: "로그인 필요" }, { status: 401 });
  }

  try {
    const boards = await prisma.memoBoard.findMany({
      where: { userId: Number(userId) },
      include: {
        user: {
          select: { name: true },
        },
      },
      // 🔥 정렬 기준을 index로 변경합니다. 
      // index가 같을 경우를 대비해 id 순서를 2순위로 둡니다.
      orderBy: [
        { index: "asc" },
        { id: "asc" }
      ],
    });

    return NextResponse.json(boards);
  } catch (error) {
    console.error("보드 조회 에러:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { title, background } = await req.json();
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ message: "로그인 필요" }, { status: 401 });
  }

  try {
    // 새 보드 추가 시 가장 큰 index + 1을 부여합니다.
    const lastBoard = await prisma.memoBoard.findFirst({
      where: { userId: Number(userId) },
      orderBy: { index: 'desc' },
    });
    
    const newIndex = lastBoard ? lastBoard.index + 1 : 0;

    const newBoard = await prisma.memoBoard.create({
      data: {
        title,
        background,
        index: newIndex,
        userId: Number(userId),
      },
    });

    return NextResponse.json(newBoard);
  } catch (error) {
    console.error("보드 생성 에러:", error);
    return NextResponse.json({ message: "생성 실패" }, { status: 500 });
  }
}