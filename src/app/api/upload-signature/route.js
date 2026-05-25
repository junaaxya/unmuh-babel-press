import { NextResponse } from "next/server";
import { authorize } from "@/lib/authorize";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "application/pdf",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024;

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

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Format file tidak diizinkan. Gunakan JPG, PNG, WEBP, atau PDF." },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const uploadBuffer = Buffer.from(buffer);

    if (uploadBuffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 50MB." },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name) || (file.type === "application/pdf" ? ".pdf" : ".jpg");
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `${baseName}_${Date.now()}${ext}`;

    const safeFolder = String(targetFolder).replace(/[^a-zA-Z0-9_-]/g, "");
    const uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), uploadBuffer);

    return NextResponse.json({
      url: `/uploads/${safeFolder}/${fileName}`,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}