import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authorize } from '@/lib/authorize';

export async function GET() {
  const hero = await prisma.profileHero.findFirst({
    include: { stats: { orderBy: { order: 'asc' } } },
  });
  return NextResponse.json({ status: 'success', data: hero });
}

export async function PUT(request) {
  const authError = await authorize(request, ['ADMIN']);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { title, subtitle, description, stats } = body;
    const hero = await prisma.profileHero.upsert({
      where: { id: 1 },
      update: { title, subtitle, description },
      create: { id: 1, title, subtitle, description },
    });
    if (Array.isArray(stats)) {
      await prisma.heroStat.deleteMany({ where: { heroId: hero.id } });
      for (const [index, stat] of stats.entries()) {
        await prisma.heroStat.create({
          data: {
            heroId: hero.id,
            number: stat.number ?? 0,
            label: stat.label ?? '',
            suffix: stat.suffix || null,
            icon: stat.icon || null,
            order: index,
          },
        });
      }
    }
    const updated = await prisma.profileHero.findFirst({
      include: { stats: { orderBy: { order: 'asc' } } },
    });
    return NextResponse.json({ status: 'success', data: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: 'error', message: 'Failed to update hero' }, { status: 500 });
  }
}
