import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const visionMission = await prisma.visionMission.findFirst({
    include: { missions: { orderBy: { order: 'asc' } } },
  });

  return NextResponse.json({
    status: 'success',
    data: visionMission ?? { vision: '', missions: [] },
  });
}
