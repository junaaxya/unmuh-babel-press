import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const team = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json({ status: 'success', data: team });
}
