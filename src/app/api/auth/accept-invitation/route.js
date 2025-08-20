import { NextResponse } from 'next/server';

import { hashPassword } from '@/lib/hash';
import { prisma } from '@/lib/db';

export async function POST(request) {
  const { token, name, password } = await request.json();

  const invite = await prisma.invitation.findUnique({ where: { token } });
  if (!invite || invite.expires < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: invite.email } });
  if (!user || user.status !== 'INVITED') {
    return NextResponse.json({ error: 'User not found' }, { status: 400 });
  }
  const hashed = await hashPassword(password);
  await prisma.user.update({
    where: { email: invite.email },
    data: { name, hashedPassword: hashed, status: 'ACTIVE' },
  });
  await prisma.invitation.delete({ where: { token } });

  return NextResponse.json({ ok: true });
}

