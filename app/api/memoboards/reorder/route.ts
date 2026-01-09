// app/api/memoboards/reorder/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { boardIds }: { boardIds: number[] } = await req.json();

    // 트랜잭션을 사용하여 배열의 순서대로 index를 0, 1, 2... 로 업데이트합니다.
    await prisma.$transaction(
      boardIds.map((id, idx) =>
        prisma.memoBoard.update({
          where: { id },
          data: { index: idx }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("순서 저장 에러:", error);
    return NextResponse.json({ error: "순서 저장 실패" }, { status: 500 });
  }
}