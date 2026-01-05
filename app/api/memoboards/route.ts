import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ message: "로그인 필요" }, { status: 401 });
  }

  const boards = await prisma.memoBoard.findMany({
    where: { userId: Number(userId) },
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(boards);
}
