import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const contact = await prisma.contact.findFirst({
    include: { socialLinks: { orderBy: { order: 'asc' } } },
  });
  return NextResponse.json({ status: 'success', data: contact });
}
