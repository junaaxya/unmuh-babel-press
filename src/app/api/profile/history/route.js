import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const history = await prisma.historyItem.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json({ status: 'success', data: history });
}
