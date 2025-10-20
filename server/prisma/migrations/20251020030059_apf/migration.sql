-- CreateTable
CREATE TABLE `ActivityProposal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cashForm` VARCHAR(191) NULL,
    `foodForm` VARCHAR(191) NULL,
    `supplyForm` VARCHAR(191) NULL,
    `reproductionForm` VARCHAR(191) NULL,
    `otherForm` VARCHAR(191) NULL,
    `attendees` INTEGER NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `venue` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `participants` VARCHAR(191) NOT NULL,
    `purpose` VARCHAR(191) NOT NULL,
    `requirements` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ActivityProposal` ADD CONSTRAINT `ActivityProposal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
