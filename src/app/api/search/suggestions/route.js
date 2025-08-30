import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { applyRateLimit } from '@/lib/rateLimit';

export async function GET(request) {
  const rateLimitResponse = await applyRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim().toLowerCase();
    if (!q || q.length < 3) {
      return NextResponse.json([]);
    }

    const [books, news, events] = await Promise.all([
      prisma.book.findMany({
        where: {
          status: 'published',
          title: { contains: q },
        },
        select: { id: true, title: true },
        orderBy: { published_at: 'desc' },
        take: 5,
      }),
      prisma.news.findMany({
        where: {
          status: 'published',
          title: { contains: q },
        },
        select: { slug: true, title: true },
        orderBy: { date: 'desc' },
        take: 5,
      }),
      prisma.event.findMany({
        where: {
          publishStatus: 'published',
          status: { in: ['Upcoming', 'Ongoing'] },
          title: { contains: q },
        },
        select: { slug: true, title: true },
        orderBy: { date: 'desc' },
        take: 5,
      }),
    ]);

    const suggestions = [
      ...books.map((b) => ({ type: 'book', id: b.id.toString(), title: b.title })),
      ...news.map((n) => ({ type: 'news', slug: n.slug, title: n.title })),
      ...events.map((e) => ({ type: 'event', slug: e.slug, title: e.title })),
    ];

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Search suggestions error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
