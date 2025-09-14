import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// ---------- Cloudinary Config (server-only) ----------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

// Helper: stream a Buffer into Cloudinary upload_stream
function bufferToUploadStream(buffer, options) {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    Readable.from(buffer).pipe(upload);
  });
}

// Basic MIME/extension allowlist
const ALLOWED_EXTS = new Set(['.ico', '.png', '.svg']);
const ALLOWED_MIMES = new Set(['image/x-icon', 'image/vnd.microsoft.icon', 'image/png', 'image/svg+xml']);

// Max 512 KB
const MAX_SIZE_BYTES = 512 * 1024;

export async function POST(request) {
  try {
    // ---------- AuthZ ----------
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'EDITOR'].includes(session.user?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ---------- Parse multipart form ----------
    const form = await request.formData();
    const file = form.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'File required' }, { status: 400 });
    }

    // ---------- Type & size validation ----------
    const name = file.name || '';
    const lower = name.toLowerCase();
    const ext = lower.slice(lower.lastIndexOf('.')) || ''; // includes the dot
    const mime = file.type || '';

    // Validate by extension or MIME (both if available)
    if (!ALLOWED_EXTS.has(ext) && !ALLOWED_MIMES.has(mime)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'File too large (max 512KB)' }, { status: 400 });
    }

    // ---------- Upload to Cloudinary (overwrite same public_id) ----------
    // Use a stable public_id to always replace the old favicon.
    const publicId = 'favicon_unmuh_press';

    // resource_type: 'image' works for ico/png/svg; invalidate busts CDN cache
    const uploadOptions = {
      resource_type: 'image',
      public_id: publicId,
      overwrite: true,
      invalidate: true,
      unique_filename: false, // use our fixed public_id
      folder: undefined,      // keep at root; set a folder if you prefer
    };

    const result = await bufferToUploadStream(buffer, uploadOptions);
    const { secure_url } = result || {};

    if (!secure_url) {
      return NextResponse.json({ error: 'Upload failed: no URL returned' }, { status: 502 });
    }

    // ---------- Persist to DB via Prisma ----------
    // Adjust `where` if your SiteSetting row isn’t always id=1
    const saved = await prisma.siteSetting.upsert({
      where:  { id: 1 },
      update: { faviconUrl: secure_url },
      create: { faviconUrl: secure_url },
    });

    // ---------- Return public URL ----------
    return NextResponse.json({ url: secure_url, setting: { id: saved.id } }, { status: 200 });
  } catch (error) {
    // Strong error reporting (avoid leaking secrets)
    console.error('Favicon upload error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to upload favicon. Please try again.' },
      { status: 500 }
    );
  }
}
