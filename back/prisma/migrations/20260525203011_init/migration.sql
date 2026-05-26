-- CreateTable
CREATE TABLE `work_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `executor_name` VARCHAR(191) NOT NULL,
    `volume` DOUBLE NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `work_date` DATETIME(3) NOT NULL,
    `work_type_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `work_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `work_logs` ADD CONSTRAINT `work_logs_work_type_id_fkey` FOREIGN KEY (`work_type_id`) REFERENCES `work_types`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
