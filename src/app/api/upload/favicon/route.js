import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient, Prisma } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const form = await request.formData();
  const file = form.get('file');
  if (!file || !file.name) {
    return NextResponse.json({ error: 'File required' }, { status: 400 });
  }
  const ext = path.extname(file.name).toLowerCase();
  if (!['.ico', '.png'].includes(ext)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  const filename = `favicon-${Date.now()}${ext}`;
  await fs.writeFile(path.join(uploadDir, filename), buffer);
  const url = `/uploads/${filename}`;
  try {
    await prisma.siteSetting.upsert({
      where: { id: 1 },
      update: { faviconUrl: url },
      create: { faviconUrl: url },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2022') {
      return NextResponse.json(
        { error: 'Database not migrated: missing faviconUrl column' },
        { status: 500 }
      );
    }
    throw err;
  }
  return NextResponse.json({ url });
}
