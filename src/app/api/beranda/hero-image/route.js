import { NextResponse } from 'next/server';
import { authorize } from '@/lib/authorize';
import { prisma } from '@/lib/db';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function bufferToUploadStream(buffer, options) {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    Readable.from(buffer).pipe(upload);
  });
}

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
      return NextResponse.json({ error: 'Upload failed' }, { status: 502 });
    }

    await prisma.homeContent.upsert({
      where: { id: 1 },
      update: { heroImageUrl: secure_url },
      create: { heroImageUrl: secure_url },
    });

    return NextResponse.json({ url: secure_url });
  } catch (error) {
    console.error('Hero image upload error:', error);
    return NextResponse.json({ error: 'Failed to upload hero image' }, { status: 500 });
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

    await prisma.homeContent.upsert({
      where: { id: 1 },
      update: { heroImageUrl: null },
      create: { heroImageUrl: null },
    });

    return NextResponse.json({ message: 'Hero image deleted' });
  } catch (error) {
    console.error('Hero image delete error:', error);
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}
