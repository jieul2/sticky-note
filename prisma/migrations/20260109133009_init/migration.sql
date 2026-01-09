-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `color` VARCHAR(191) NOT NULL DEFAULT '#facc15',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemoBoard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `background` VARCHAR(191) NOT NULL,
    `index` INTEGER NOT NULL DEFAULT 0,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Memo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `boardId` INTEGER NOT NULL,
    `content` LONGTEXT NOT NULL,
    `x` INTEGER NOT NULL DEFAULT 0,
    `y` INTEGER NOT NULL DEFAULT 0,
    `width` INTEGER NOT NULL DEFAULT 200,
    `height` INTEGER NOT NULL DEFAULT 100,
    `fontSize` INTEGER NOT NULL DEFAULT 14,
    `fontColor` VARCHAR(191) NOT NULL DEFAULT '#000000',
    `fontWeight` VARCHAR(191) NOT NULL DEFAULT 'normal',
    `fontFamily` VARCHAR(191) NOT NULL DEFAULT 'Arial',
    `backgroundColor` VARCHAR(191) NOT NULL DEFAULT '#ffffff',
    `borderWidth` INTEGER NOT NULL DEFAULT 1,
    `borderColor` VARCHAR(191) NOT NULL DEFAULT '#000000',
    `overflow` VARCHAR(191) NOT NULL DEFAULT 'hidden',
    `textAlign` VARCHAR(191) NOT NULL DEFAULT 'left',
    `verticalAlign` VARCHAR(191) NOT NULL DEFAULT 'top',
    `modifiedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MemoBoard` ADD CONSTRAINT `MemoBoard_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Memo` ADD CONSTRAINT `Memo_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `MemoBoard`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
