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
      return NextResponse.json({ books: [], news: [], events: [] });
    }

    const [books, news, events] = await Promise.all([
      // Query untuk Books (setelah diperbaiki)
      prisma.book.findMany({
        where: {
          status: 'published',
          OR: [
            { title: { contains: q } },
            { penulis: { contains: q } },
            { sinopsis: { contains: q } },
          ],
        },
        // 'slug' dihapus dari select karena tidak ada di model Book Anda
        select: { id: true, title: true, penulis: true, image: true }, 
        orderBy: { published_at: 'desc' },
      }),

      // Query untuk News
      prisma.news.findMany({
        where: {
          status: 'published',
          OR: [
            { title: { contains: q } },
            { content: { contains: q } },
            { excerpt: { contains: q } },
          ],
        },
        select: { id: true, slug: true, title: true, image: true, date: true },
        orderBy: { date: 'desc' },
      }),

      // Query untuk Events
      prisma.event.findMany({
        where: {
          publishStatus: 'published',
          status: { in: ['Upcoming', 'Ongoing'] },
          OR: [
            { title: { contains: q } },
            { content: { contains: q } },
            { location: { contains: q } },
          ],
        },
        select: { id: true, slug: true, title: true, location: true, image: true, date: true },
        orderBy: { date: 'desc' },
      }),
    ]);

    const serializedBooks = books.map((book) => ({
      ...book,
      id: book.id.toString(),
    }));

    return NextResponse.json({ books: serializedBooks, news, events });
  } catch (error) {
    console.error('Global search error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}