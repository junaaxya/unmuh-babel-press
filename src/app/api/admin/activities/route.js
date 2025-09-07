import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50);
  const type = searchParams.get('type');
  const q = searchParams.get('q') || '';

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: 'Invalid page' }, { status: 400 });
  }
  if (isNaN(limit) || limit < 1) {
    return NextResponse.json({ error: 'Invalid limit' }, { status: 400 });
  }

  const offset = (page - 1) * limit;
  const searchFilter = q ? Prisma.sql`WHERE title LIKE ${'%' + q + '%'}` : Prisma.empty;

  try {
    let activitiesRaw;
    let total = 0;

    if (type === 'book') {
      activitiesRaw = await prisma.$queryRaw`SELECT 'book' AS type, id, title, status, created_at AS createdAt, updated_at AS updatedAt FROM Book ${searchFilter} ORDER BY updatedAt DESC LIMIT ${limit} OFFSET ${offset}`;
      total = await prisma.book.count({ where: { title: { contains: q } } });
    } else if (type === 'news') {
      activitiesRaw = await prisma.$queryRaw`SELECT 'news' AS type, id, title, status, created_at AS createdAt, updated_at AS updatedAt FROM News ${searchFilter} ORDER BY updatedAt DESC LIMIT ${limit} OFFSET ${offset}`;
      total = await prisma.news.count({ where: { title: { contains: q } } });
    } else if (type === 'event') {
      activitiesRaw = await prisma.$queryRaw`SELECT 'event' AS type, id, title, publish_status AS status, created_at AS createdAt, updated_at AS updatedAt FROM Event ${searchFilter} ORDER BY updatedAt DESC LIMIT ${limit} OFFSET ${offset}`;
      total = await prisma.event.count({ where: { title: { contains: q } } });
    } else {
      activitiesRaw = await prisma.$queryRaw`
        SELECT * FROM (
          SELECT 'book' AS type, id, title, status, created_at AS createdAt, updated_at AS updatedAt FROM Book ${searchFilter}
          UNION ALL
          SELECT 'news' AS type, id, title, status, created_at AS createdAt, updated_at AS updatedAt FROM News ${searchFilter}
          UNION ALL
          SELECT 'event' AS type, id, title, publish_status AS status, created_at AS createdAt, updated_at AS updatedAt FROM Event ${searchFilter}
        ) AS combined
        ORDER BY updatedAt DESC
        LIMIT ${limit} OFFSET ${offset}`;
      const [b, n, e] = await Promise.all([
        prisma.book.count({ where: { title: { contains: q } } }),
        prisma.news.count({ where: { title: { contains: q } } }),
        prisma.event.count({ where: { title: { contains: q } } }),
      ]);
      total = b + n + e;
    }

    const activities = activitiesRaw.map((a) => ({
      ...a,
      action:
        new Date(a.updatedAt).getTime() - new Date(a.createdAt).getTime() < 1000
          ? 'created'
          : 'updated',
      timestamp: a.updatedAt,
    }));

    return NextResponse.json(
      {
        activities,
        pagination: {
          page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          pageSize: limit,
        },
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    console.error('Error fetching activities', err);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}
