import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authorize } from '@/lib/authorize';

export const revalidate = 0;

export async function GET() {
  try {
    const hero = await prisma.profileHero.findFirst();
    return NextResponse.json({ status: 'success', data: hero || {} });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch hero' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const authError = await authorize(request, ['ADMIN']);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { title, subtitle, description } = body;
    const hero = await prisma.profileHero.upsert({
      where: { id: 1 },
      update: { title, subtitle, description },
      create: { id: 1, title, subtitle, description },
    });
    return NextResponse.json({ status: 'success', data: hero });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: 'error', message: 'Failed to update hero' }, { status: 500 });
  }
}
