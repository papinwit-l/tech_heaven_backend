/*
  Warnings:

  - You are about to drop the column `signup_method` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `drive` ADD COLUMN `PCBuildId` INTEGER NULL;

-- AlterTable
ALTER TABLE `memory` ADD COLUMN `PCBuildId` INTEGER NULL;

-- AlterTable
ALTER TABLE `monitor` ADD COLUMN `PCBuildId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `signup_method`,
    ADD COLUMN `googleId` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `PCBuild` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NULL,
    `cpu_id` INTEGER NOT NULL,
    `motherboard_id` INTEGER NOT NULL,
    `gpu_id` INTEGER NOT NULL,
    `memory_id` INTEGER NOT NULL,
    `power_supply_id` INTEGER NOT NULL,
    `case_id` INTEGER NOT NULL,
    `drive_id` INTEGER NOT NULL,
    `cpu_cooler_id` INTEGER NOT NULL,
    `monitor_id` INTEGER NOT NULL,
    `totalPrice` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PCBuild` ADD CONSTRAINT `PCBuild_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PCBuild` ADD CONSTRAINT `PCBuild_cpu_id_fkey` FOREIGN KEY (`cpu_id`) REFERENCES `cpu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PCBuild` ADD CONSTRAINT `PCBuild_motherboard_id_fkey` FOREIGN KEY (`motherboard_id`) REFERENCES `Motherboard`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PCBuild` ADD CONSTRAINT `PCBuild_gpu_id_fkey` FOREIGN KEY (`gpu_id`) REFERENCES `gpu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PCBuild` ADD CONSTRAINT `PCBuild_power_supply_id_fkey` FOREIGN KEY (`power_supply_id`) REFERENCES `power_supply`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PCBuild` ADD CONSTRAINT `PCBuild_case_id_fkey` FOREIGN KEY (`case_id`) REFERENCES `Case`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PCBuild` ADD CONSTRAINT `PCBuild_cpu_cooler_id_fkey` FOREIGN KEY (`cpu_cooler_id`) REFERENCES `cpu_cooler`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Memory` ADD CONSTRAINT `Memory_PCBuildId_fkey` FOREIGN KEY (`PCBuildId`) REFERENCES `PCBuild`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Drive` ADD CONSTRAINT `Drive_PCBuildId_fkey` FOREIGN KEY (`PCBuildId`) REFERENCES `PCBuild`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Monitor` ADD CONSTRAINT `Monitor_PCBuildId_fkey` FOREIGN KEY (`PCBuildId`) REFERENCES `PCBuild`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
