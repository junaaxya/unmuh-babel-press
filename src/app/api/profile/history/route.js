import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authorize } from '@/lib/authorize';

export const revalidate = 0;

export async function GET() {
  try {
    const history = await prisma.historyItem.findMany({ 
      orderBy: { order: 'asc' } 
    });
    return NextResponse.json({ status: 'success', data: history });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const authError = await authorize(request, ['ADMIN']);
  if (authError) return authError;

  try {
    const historyItems = await request.json();

    // Delete all existing history items
    await prisma.historyItem.deleteMany();

    // Create new history items
    if (Array.isArray(historyItems)) {
      for (const [index, item] of historyItems.entries()) {
        await prisma.historyItem.create({
          data: {
            year: item.year || '',
            title: item.title || '',
            description: item.description || '',
            order: index,
          },
        });
      }
    }

    // Fetch updated data
    const updated = await prisma.historyItem.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({ status: 'success', data: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { status: 'error', message: 'Failed to update history' },
      { status: 500 }
    );
  }
}