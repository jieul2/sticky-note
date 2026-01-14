-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoBoard" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemoBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memo" (
    "id" SERIAL NOT NULL,
    "boardId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "x" INTEGER NOT NULL DEFAULT 0,
    "y" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER NOT NULL DEFAULT 200,
    "height" INTEGER NOT NULL DEFAULT 100,
    "fontSize" INTEGER NOT NULL DEFAULT 14,
    "fontColor" TEXT NOT NULL DEFAULT '#000000',
    "fontWeight" TEXT NOT NULL DEFAULT 'normal',
    "fontFamily" TEXT NOT NULL DEFAULT 'Arial',
    "backgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "borderWidth" INTEGER NOT NULL DEFAULT 1,
    "borderColor" TEXT NOT NULL DEFAULT '#000000',
    "overflow" TEXT NOT NULL DEFAULT 'hidden',
    "textAlign" TEXT NOT NULL DEFAULT 'left',
    "verticalAlign" TEXT NOT NULL DEFAULT 'top',
    "modifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Memo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "MemoBoard" ADD CONSTRAINT "MemoBoard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memo" ADD CONSTRAINT "Memo_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "MemoBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
