import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authorize } from '@/lib/authorize';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1),
  price: z.number().int().positive(),
  features: z.array(z.union([
    z.string(),
    z.object({ text: z.string(), highlight: z.boolean().optional() })
  ])),
  isPopular: z.boolean().optional().default(false),
  bgColor: z.string().min(1).optional().default('bg-gray-800'),
  textColor: z.string().min(1).optional().default('text-white'),
  isActive: z.boolean().optional().default(true),
});

export async function PUT(request, context) {
  const authError = await authorize(request, ['ADMIN']);
  if (authError) return authError;
  const { id } = await context.params; // FIX: await params (Next.js 15)
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const pkg = await prisma.servicePackage.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json(pkg);
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Service package not found' }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to update service package' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  const authError = await authorize(request, ['ADMIN']);
  if (authError) return authError;
  const { id } = await context.params; // FIX: await params (Next.js 15)
  try {
    await prisma.servicePackage.delete({ where: { id } });
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Service package not found' }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to delete service package' },
      { status: 500 }
    );
  }
}