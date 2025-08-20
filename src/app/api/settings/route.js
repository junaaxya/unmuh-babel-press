import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

const prisma = new PrismaClient();

export async function GET() {
  noStore();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  if (!settings) return NextResponse.json({});

  const {
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
    revalidateSeconds,
    ...safeSettings
  } = settings;
  return NextResponse.json(safeSettings);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!['ADMIN', 'EDITOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const payload = await request.json();
  const {
    id,
    createdAt,
    updatedAt,
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
    revalidateSeconds,
    ...data
  } = payload;
  const updated = await prisma.siteSetting.update({
    where: { id: 1 },
    data,
  });
  return NextResponse.json(updated);
}
