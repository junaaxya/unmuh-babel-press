import { PrismaClient } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

const prisma = new PrismaClient();

export async function getSiteSettings() {
  noStore();
  const settings = await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: { siteName: '', sessionMaxAgeHours: 24 },
  });
  return settings;
}
