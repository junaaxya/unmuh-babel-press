import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { applyRateLimit } from '@/lib/rateLimit';

export async function GET(request) {
  const rateLimitResponse = await applyRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim().toLowerCase();
    if (!q) {
      return NextResponse.json([]);
    }

    const events = await prisma.event.findMany({
      where: {
        publishStatus: 'published',
        status: { in: ['Upcoming', 'Ongoing'] },
        OR: [
          { title: { contains: q } },
          { content: { contains: q } },
          { location: { contains: q } },
        ],
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Events search error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

