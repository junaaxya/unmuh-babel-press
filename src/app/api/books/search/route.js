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

    const books = await prisma.book.findMany({
      where: {
        status: 'published',
        OR: [
          { title: { contains: q } },
          { penulis: { contains: q } },
          { sinopsis: { contains: q } },
        ],
      },
      orderBy: { published_at: 'desc' },
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error('Books search error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

