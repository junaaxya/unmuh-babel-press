import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const revalidate = 0;

export async function GET() {
  try {
    const packages = await prisma.servicePackage.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ data: packages });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch service packages' },
      { status: 500 }
    );
  }
}
