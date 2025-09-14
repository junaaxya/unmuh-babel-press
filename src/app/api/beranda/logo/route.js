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
      public_id: 'unmuh_press_logo',
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

    await prisma.siteSetting.upsert({
      where: { id: 1 },
      update: { logoUrl: secure_url },
      create: { id: 1, logoUrl: secure_url },
    });

    return NextResponse.json({ url: secure_url });
  } catch (error) {
    console.error('Logo upload error:', error);
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
    await cloudinary.uploader.destroy('unmuh_press_logo', {
      resource_type: 'image',
      invalidate: true,
    });

    await prisma.siteSetting.upsert({
      where: { id: 1 },
      update: { logoUrl: null },
      create: { id: 1, logoUrl: null },
    });

    return NextResponse.json({ message: 'Logo deleted' });
  } catch (error) {
    console.error('Logo delete error:', error);
    return NextResponse.json(
      { message: 'Deletion failed', details: error.message },
      { status: 500 }
    );
  }
}
