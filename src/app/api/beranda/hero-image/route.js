import { NextResponse } from 'next/server';
import { authorize } from '@/lib/authorize';
import { prisma } from '@/lib/db';
import { cloudinary, bufferToUploadStream } from '@/lib/cloudinary';

export async function POST(request) {
  const authError = await authorize(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await bufferToUploadStream(buffer, {
      resource_type: 'image',
      public_id: 'unmuh_press_hero_image',
      overwrite: true,
      invalidate: true,
      unique_filename: false,
    });

    const { secure_url } = result || {};
    if (!secure_url) {
      return NextResponse.json(
        { message: 'Upload failed', details: 'Cloudinary did not return a URL' },
        { status: 502 }
      );
    }

    if (!prisma.homeContent) {
      console.error('HomeContent model is unavailable in Prisma client');
      return NextResponse.json(
        { message: 'Upload failed', details: 'HomeContent model not found' },
        { status: 500 }
      );
    }

    await prisma.homeContent.upsert({
      where: { id: 1 },
      update: { heroImageUrl: secure_url },
      create: { id: 1, heroImageUrl: secure_url },
    });

    return NextResponse.json({ url: secure_url });
  } catch (error) {
    console.error('Hero image upload error:', error);
    return NextResponse.json(
      { message: 'Upload failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const authError = await authorize(request);
  if (authError) return authError;

  try {
    await cloudinary.uploader.destroy('unmuh_press_hero_image', {
      resource_type: 'image',
      invalidate: true,
    });

    if (!prisma.homeContent) {
      console.error('HomeContent model is unavailable in Prisma client');
      return NextResponse.json(
        { message: 'Deletion failed', details: 'HomeContent model not found' },
        { status: 500 }
      );
    }

    await prisma.homeContent.upsert({
      where: { id: 1 },
      update: { heroImageUrl: null },
      create: { id: 1, heroImageUrl: null },
    });

    return NextResponse.json({ message: 'Hero image deleted' });
  } catch (error) {
    console.error('Hero image delete error:', error);
    return NextResponse.json(
      { message: 'Deletion failed', details: error.message },
      { status: 500 }
    );
  }
}
