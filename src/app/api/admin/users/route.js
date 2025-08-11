import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { hashPassword } from '@/lib/hash';

const prisma = new PrismaClient();

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, createdAt: true } });
  return NextResponse.json(users);
}

export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { email, password, role } = await request.json();
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({ data: { email, password: hashed, role } });
  return NextResponse.json({ id: user.id });
}

export async function PUT(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, role } = await request.json();
  await prisma.user.update({ where: { id }, data: { role } });
  return NextResponse.json({ ok: true });
}
