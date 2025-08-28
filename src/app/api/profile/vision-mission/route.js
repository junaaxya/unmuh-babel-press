import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authorize } from '@/lib/authorize';

export const revalidate = 0;

export async function GET() {
  try {
    const visionMission = await prisma.visionMission.findFirst({
      include: { missions: { orderBy: { order: 'asc' } } },
    });
    return NextResponse.json({ status: 'success', data: visionMission });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch vision mission' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const authError = await authorize(request, ['ADMIN']);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { vision, missions } = body;

    // Upsert vision mission
    const visionMission = await prisma.visionMission.upsert({
      where: { id: 1 },
      update: { vision },
      create: { id: 1, vision },
    });

    // Delete existing missions
    await prisma.mission.deleteMany({
      where: { visionMissionId: visionMission.id }
    });

    // Create new missions
    if (Array.isArray(missions)) {
      for (const [index, mission] of missions.entries()) {
        await prisma.mission.create({
          data: {
            visionMissionId: visionMission.id,
            text: mission.text || mission, // Handle both object and string format
            order: index,
          },
        });
      }
    }

    // Fetch updated data
    const updated = await prisma.visionMission.findFirst({
      include: { missions: { orderBy: { order: 'asc' } } },
    });

    return NextResponse.json({ status: 'success', data: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { status: 'error', message: 'Failed to update vision mission' },
      { status: 500 }
    );
  }
}