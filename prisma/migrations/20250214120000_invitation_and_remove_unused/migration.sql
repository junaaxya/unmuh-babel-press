-- Drop obsolete fields from SiteSetting
ALTER TABLE `SiteSetting`
    DROP COLUMN `contactPhone`,
    DROP COLUMN `address`,
    DROP COLUMN `imageDomains`,
    DROP COLUMN `webhookUrl`;

-- Create Invitation table for user invitations
CREATE TABLE `Invitation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN','EDITOR','VIEWER') NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Invitation_email_key`(`email`),
    UNIQUE INDEX `Invitation_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

