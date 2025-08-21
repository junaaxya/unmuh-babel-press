import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { unstable_noStore as noStore } from 'next/cache';

const SettingsSchema = z
  .object({
    siteName: z.string().trim().min(1, 'Site name is required'),
    sessionMaxAgeHours: z.coerce
      .number()
      .int({ message: 'Must be an integer' })
      .min(1)
      .max(720),
    faviconUrl: z
      .string()
      .trim()
      .url()
      .or(z.string().trim().startsWith('/'))
      .optional()
      .or(z.literal(''))
      .transform((v) => (v ? v : undefined)),
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
  const data = { ...parsed.data };
  if (data.faviconUrl === undefined) delete data.faviconUrl;
  const updated = await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: data,
    create: data,
  });
  return NextResponse.json(updated);
}

export const PATCH = PUT;
