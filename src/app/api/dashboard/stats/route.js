import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

function calcTrend(current, previous) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const startCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalBooks,
      prevBooks,
      totalNews,
      prevNews,
      upcomingEvents,
      recentBooks,
      recentNews,
      recentEvents,
      visitorsRes,
    ] = await Promise.all([
      prisma.book.count(),
      prisma.book.count({ where: { created_at: { lt: startCurrentMonth } } }),
      prisma.news.count({ where: { status: 'published' } }),
      prisma.news.count({
        where: { status: 'published', published_at: { lt: startCurrentMonth } },
      }),
      prisma.event.count({ where: { date: { gte: now } } }),
      prisma.book.findMany({
        orderBy: { updated_at: 'desc' },
        take: 5,
        select: { title: true, updated_at: true, status: true },
      }),
      prisma.news.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: { title: true, updatedAt: true, status: true },
      }),
      prisma.event.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: { title: true, updatedAt: true, publishStatus: true },
      }),
      // Fetch visitors dengan fallback aman jika GA belum dikonfigurasi
      fetch(new URL('/api/analytics/visitors', request.url).toString(), {
        headers: { cookie: request.headers.get('cookie') || '' },
      })
        .then((res) => {
          if (!res.ok) return { total: 0, previous: 0 };
          return res.json();
        })
        .then((data) => ({
          total: typeof data?.total === 'number' ? data.total : 0,
          previous: typeof data?.previous === 'number' ? data.previous : 0,
        }))
        .catch(() => ({ total: 0, previous: 0 })),
    ]);

    const recentActivity = [
      ...recentBooks.map((b) => ({
        type: 'book',
        title: b.title,
        time: b.updated_at || new Date(),
        status: b.status,
      })),
      ...recentNews.map((n) => ({
        type: 'news',
        title: n.title,
        time: n.updatedAt || new Date(),
        status: n.status,
      })),
      ...recentEvents.map((e) => ({
        type: 'event',
        title: e.title,
        time: e.updatedAt || new Date(),
        status: e.publishStatus,
      })),
    ]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);

    return NextResponse.json({
      stats: {
        books:    { total: totalBooks ?? 0,        trend: calcTrend(totalBooks, prevBooks) },
        news:     { total: totalNews ?? 0,         trend: calcTrend(totalNews, prevNews) },
        events:   { total: upcomingEvents ?? 0,    trend: 0 },
        visitors: { total: visitorsRes.total ?? 0, trend: calcTrend(visitorsRes.total, visitorsRes.previous) },
      },
      recentActivity: recentActivity.map((a) => ({
        ...a,
        time: new Date(a.time).toISOString(),
      })),
    });
  } catch (err) {
    console.error('Error fetching dashboard stats', err);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}