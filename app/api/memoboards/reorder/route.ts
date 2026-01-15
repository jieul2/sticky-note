import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 클라이언트로부터 받은 ID 배열 (문자열 배열로 가정)
    const boardIds: string[] = body.boardIds;

    if (!boardIds || !Array.isArray(boardIds)) {
      return NextResponse.json({ error: "Invalid boardIds" }, { status: 400 });
    }

    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        await prisma.$transaction(
          boardIds.map((id: string, idx: number) =>
            prisma.memoBoard.update({
              // 에러 해결 지점: id가 DB에서 Int(number) 타입이므로 Number()로 변환
              where: { id: Number(id) }, 
              data: { 
                order: idx 
              },
            })
          ),
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          }
        );
        
        break; // 성공 시 루프 탈출
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2034' && 
          retryCount < maxRetries - 1
        ) {
          retryCount++;
          // 데드락 발생 시 대기 후 재시도
          await new Promise((resolve) => setTimeout(resolve, retryCount * 100));
          continue;
        }
        throw error;
      }
    }

    return NextResponse.json({ success: true, message: "순서가 저장되었습니다." });
  } catch (error) {
    console.error("순서 저장 에러 상세:", error);
    
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 에러가 발생했습니다.";
    
    return NextResponse.json(
      { 
        error: "순서 저장 중 오류가 발생했습니다.", 
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}