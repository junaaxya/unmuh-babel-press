import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authorize } from '@/lib/authorize';

export const revalidate = 0;

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
      include: { features: { orderBy: { order: 'asc' } } },
    });
    return NextResponse.json({ status: 'success', data: services });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const authError = await authorize(request, ['ADMIN']);
  if (authError) return authError;

  try {
    const services = await request.json();

    // Delete all existing services and their features
    await prisma.serviceFeature.deleteMany();
    await prisma.service.deleteMany();

    // Create new services
    if (Array.isArray(services)) {
      for (const [index, service] of services.entries()) {
        const createdService = await prisma.service.create({
          data: {
            title: service.title || '',
            description: service.description || '',
            order: index,
          },
        });

        // Create service features
        if (Array.isArray(service.features)) {
          for (const [featureIndex, feature] of service.features.entries()) {
            await prisma.serviceFeature.create({
              data: {
                serviceId: createdService.id,
                text: feature.text || feature, // Handle both object and string format
                order: featureIndex,
              },
            });
          }
        }
      }
    }

    // Fetch updated data
    const updated = await prisma.service.findMany({
      orderBy: { order: 'asc' },
      include: { features: { orderBy: { order: 'asc' } } },
    });

    return NextResponse.json({ status: 'success', data: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { status: 'error', message: 'Failed to update services' },
      { status: 500 }
    );
  }
}