import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authorize } from '@/lib/authorize';
import { z } from 'zod';

export const revalidate = 0;

const schema = z.object({
  title: z.string().min(1),
  price: z.number().int().positive(),
  features: z.array(z.string()),
  isPopular: z.boolean().optional().default(false),
});

export async function GET(request) {
  const authError = await authorize(request, ['ADMIN']);
  if (authError) return authError;
  try {
    const packages = await prisma.servicePackage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ data: packages });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch service packages' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const authError = await authorize(request, ['ADMIN']);
  if (authError) return authError;
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const pkg = await prisma.servicePackage.create({
      data: parsed.data,
    });
    return NextResponse.json(pkg, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create service package' },
      { status: 500 }
    );
  }
}
