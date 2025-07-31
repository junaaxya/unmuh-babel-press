-- CreateTable
CREATE TABLE `News` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `excerpt` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `image` VARCHAR(500) NULL,
    `date` DATE NOT NULL,
    `category` ENUM('Berita', 'Pengumuman', 'Artikel', 'Press_Release') NOT NULL DEFAULT 'Berita',
    `author` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `News_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `excerpt` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `image` VARCHAR(500) NULL,
    `date` DATE NOT NULL,
    `time` VARCHAR(50) NOT NULL,
    `location` VARCHAR(200) NOT NULL,
    `category` ENUM('Event', 'Seminar', 'Workshop', 'Konferensi', 'Pelatihan') NOT NULL DEFAULT 'Event',
    `status` ENUM('Upcoming', 'Ongoing', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Upcoming',
    `organizer` VARCHAR(100) NOT NULL,
    `registrationEnabled` BOOLEAN NOT NULL DEFAULT false,
    `registrationTitle` VARCHAR(100) NULL,
    `registrationDescription` TEXT NULL,
    `registrationButtonText` VARCHAR(50) NULL,
    `registrationLink` VARCHAR(500) NULL,
    `registrationDeadline` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Event_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
