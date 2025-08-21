import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { unstable_noStore as noStore } from 'next/cache';

const SettingsSchema = z
  .object({
    siteName: z.string().trim().min(1),
    faviconUrl: z.preprocess(
      (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
      z
        .string()
        .trim()
        .url()
        .or(z.string().trim().startsWith('/'))
        .optional()
    ),
    sessionMaxAgeHours: z.coerce.number().int().min(1).max(720),
  })
  .strip();

export async function GET() {
  noStore();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const settings = await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: { siteName: '', sessionMaxAgeHours: 24 },
  });
  return NextResponse.json(settings);
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!['ADMIN', 'EDITOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  let json;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const parsed = SettingsSchema.safeParse(json);
  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return NextResponse.json(
      { message: 'Invalid input', fieldErrors },
      { status: 400 }
    );
  }
  const updated = await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: parsed.data,
  });
  return NextResponse.json(updated);
}

export const PATCH = PUT;
