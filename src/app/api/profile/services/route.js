import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' },
    include: { features: { orderBy: { order: 'asc' } } },
  });
  return NextResponse.json({ status: 'success', data: services });
}
