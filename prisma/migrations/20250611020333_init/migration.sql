/*
  Warnings:

  - You are about to drop the column `coverUrl` on the `listbuku` table. All the data in the column will be lost.
  - You are about to drop the column `penerbit` on the `listbuku` table. All the data in the column will be lost.
  - You are about to drop the column `penulis` on the `listbuku` table. All the data in the column will be lost.
  - You are about to drop the column `tahunTerbit` on the `listbuku` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `listbuku` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Kode_Buku]` on the table `listbuku` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ISBN]` on the table `listbuku` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Editor` to the `listbuku` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Halaman` to the `listbuku` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ISBN` to the `listbuku` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Kode_Buku` to the `listbuku` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Penerbit` to the `listbuku` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Penulis` to the `listbuku` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Ukuran` to the `listbuku` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `listbuku` DROP COLUMN `coverUrl`,
    DROP COLUMN `penerbit`,
    DROP COLUMN `penulis`,
    DROP COLUMN `tahunTerbit`,
    DROP COLUMN `title`,
    ADD COLUMN `Editor` VARCHAR(191) NOT NULL,
    ADD COLUMN `Halaman` INTEGER NOT NULL,
    ADD COLUMN `ISBN` VARCHAR(191) NOT NULL,
    ADD COLUMN `Kode_Buku` VARCHAR(191) NOT NULL,
    ADD COLUMN `Penerbit` VARCHAR(191) NOT NULL,
    ADD COLUMN `Penulis` VARCHAR(191) NOT NULL,
    ADD COLUMN `Ukuran` VARCHAR(191) NOT NULL,
    ADD COLUMN `image` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `listbuku_Kode_Buku_key` ON `listbuku`(`Kode_Buku`);

-- CreateIndex
CREATE UNIQUE INDEX `listbuku_ISBN_key` ON `listbuku`(`ISBN`);
