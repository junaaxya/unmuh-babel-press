import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { hashPassword } from '@/lib/hash';

const prisma = new PrismaClient();

async function requireRole(roles) {
  const session = await getServerSession(authOptions);
  if (!session || !roles.includes(session.user.role)) return null;
  return session;
}

export async function GET(request) {
  const session = await requireRole(['ADMIN', 'EDITOR']);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = (searchParams.get('search') || '').trim().toLowerCase();
  const where = search ? { email: { contains: search } } : {};
  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, email: true, role: true, createdAt: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);
  return NextResponse.json({ data, meta: { total, page, limit } });
}

export async function POST(request) {
  const session = await requireRole(['ADMIN']);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { email, password, role } = await request.json();
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email: email.trim().toLowerCase(), password: hashed, role },
  });
  return NextResponse.json({ id: user.id });
}

export async function PUT(request) {
  const session = await requireRole(['ADMIN']);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, role } = await request.json();
  await prisma.user.update({ where: { id }, data: { role } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request) {
  const session = await requireRole(['ADMIN']);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await request.json();
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
