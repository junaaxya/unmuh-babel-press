import { PrismaClient, Prisma } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

const prisma = new PrismaClient();

export async function getSiteSettings() {
  noStore();
  try {
    const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
    return settings || {};
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2022') {
      // column does not exist; database needs migration
      return {};
    }
    throw err;
  }
}
