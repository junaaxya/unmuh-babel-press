import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const [bookCount, authorList, newsCount, eventCount] = await Promise.all([
      prisma.book.count({ where: { status: 'published' } }),
      prisma.book.findMany({
        where: { status: 'published', penulis: { not: null } },
        distinct: ['penulis'],
        select: { penulis: true }
      }),
      prisma.news.count({ where: { status: 'published' } }),
      prisma.event.count({ where: { publishStatus: 'published' } })
    ]);

    const uniqueAuthors = new Set(
      authorList.map((a) => a.penulis).filter(Boolean)
    ).size;

    const data = {
      books: bookCount,
      authors: uniqueAuthors,
      news: newsCount,
      events: eventCount,
    };

    return NextResponse.json({ status: 'success', data });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
