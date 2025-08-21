import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const form = await request.formData();
  const file = form.get('file');
  if (!file || !file.name) {
    return NextResponse.json({ error: 'File required' }, { status: 400 });
  }
  const ext = path.extname(file.name).toLowerCase();
  if (!['.ico', '.png', '.svg'].includes(ext)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > 512 * 1024) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 });
  }
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  // In Docker deployments, ensure this path is persisted via a volume or bind mount
  await fs.mkdir(uploadDir, { recursive: true });
  const timestamp = Date.now();
  const filename = `favicon-${timestamp}${ext}`;
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);
  // Copy to root favicon.ico for universal fallback
  await fs.copyFile(filePath, path.join(process.cwd(), 'public', 'favicon.ico'));
  const url = `/uploads/${filename}?v=${timestamp}`;
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: { faviconUrl: url },
    create: { faviconUrl: url },
  });
  return NextResponse.json({ url });
}
