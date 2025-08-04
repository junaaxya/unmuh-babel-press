import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { Readable } from "stream";
import { authorize } from "@/lib/authorize";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req) {
  const authError = await authorize(req);
  if (authError) return authError;
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid content-type" }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const targetFolder = formData.get("folder");

    if (!file || !targetFolder) {
      return NextResponse.json({ error: "Missing file or folder" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const uploadBuffer = Buffer.from(buffer);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: targetFolder,
          transformation: [{ width: 1200, crop: "limit" }, { fetch_format: "auto" }, { quality: "auto" }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      Readable.from(uploadBuffer).pipe(uploadStream);
    });

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
