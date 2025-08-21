-- Refactor SiteSetting: remove obsolete fields and add faviconUrl
ALTER TABLE `SiteSetting`
    DROP COLUMN IF EXISTS `logoUrl`,
    DROP COLUMN IF EXISTS `contactEmail`,
    DROP COLUMN IF EXISTS `fromName`,
    DROP COLUMN IF EXISTS `fromEmail`,
    DROP COLUMN IF EXISTS `facebook`,
    DROP COLUMN IF EXISTS `instagram`,
    DROP COLUMN IF EXISTS `twitter`,
    DROP COLUMN IF EXISTS `defaultTitle`,
    DROP COLUMN IF EXISTS `defaultDescription`,
    DROP COLUMN IF EXISTS `ogImageUrl`,
    DROP COLUMN IF EXISTS `smtpHost`,
    DROP COLUMN IF EXISTS `smtpPort`,
    DROP COLUMN IF EXISTS `smtpUser`,
    DROP COLUMN IF EXISTS `smtpPass`,
    DROP COLUMN IF EXISTS `require2FA`,
    DROP COLUMN IF EXISTS `passwordMinLength`,
    DROP COLUMN IF EXISTS `revalidateSeconds`,
    DROP COLUMN IF EXISTS `ga4MeasurementId`,
    DROP COLUMN IF EXISTS `metaPixelId`;

ALTER TABLE `SiteSetting`
    ADD COLUMN IF NOT EXISTS `faviconUrl` VARCHAR(191) NULL,
    MODIFY `siteName` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `sessionMaxAgeHours` INTEGER NOT NULL DEFAULT 24;
