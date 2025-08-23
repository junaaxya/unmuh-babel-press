import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/hash';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, image: true },
  });

  return NextResponse.json(user);
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, password, confirmPassword } = await req.json();
  const data = {};
  if (typeof name === 'string') {
    data.name = name.trim();
  }

  if (password) {
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }
    data.hashedPassword = await hashPassword(password);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ message: 'No changes' });
  }

  await prisma.user.update({ where: { id: session.user.id }, data });
  return NextResponse.json({ message: 'Profile updated' });
}
