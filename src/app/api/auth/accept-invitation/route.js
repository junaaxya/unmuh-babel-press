import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/hash';

const prisma = new PrismaClient();

export async function POST(request) {
  const { token, name, password } = await request.json();

  const invite = await prisma.invitation.findUnique({ where: { token } });
  if (!invite || invite.expires < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: invite.email } });
  if (existing) {
    return NextResponse.json({ error: 'Email already used' }, { status: 400 });
  }

  const hashed = await hashPassword(password);
  await prisma.user.create({
    data: { email: invite.email, name, password: hashed, role: invite.role },
  });
  await prisma.invitation.delete({ where: { token } });

  return NextResponse.json({ ok: true });
}

