-- AlterTable
ALTER TABLE `news` ADD COLUMN `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft';

-- CreateTable
CREATE TABLE `Book` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `kode_buku` VARCHAR(50) NULL,
    `title` VARCHAR(255) NOT NULL,
    `isbn` VARCHAR(50) NULL,
    `penerbit` VARCHAR(255) NULL,
    `penulis` TEXT NULL,
    `editor` VARCHAR(255) NULL,
    `ukuran` VARCHAR(50) NULL,
    `halaman` VARCHAR(10) NULL,
    `image` VARCHAR(500) NULL,
    `kategori` VARCHAR(100) NULL,
    `sinopsis` TEXT NULL,
    `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    `published_at` TIMESTAMP(6) NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
