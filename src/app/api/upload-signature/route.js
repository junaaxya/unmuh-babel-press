import { NextResponse } from "next/server";
import { authorize } from "@/lib/authorize";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Fungsi ini tetap ada untuk kompatibilitas jika dipakai di tempat lain
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

    // Nama file unik agar tidak tertimpa
    const ext      = path.extname(file.name) || ".jpg";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `${baseName}_${Date.now()}${ext}`;

    // Simpan ke public/uploads/{folder}/
    const uploadDir = path.join(process.cwd(), "public", "uploads", targetFolder);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), uploadBuffer);

    const secure_url = `/uploads/${targetFolder}/${fileName}`;

    return NextResponse.json({ url: secure_url });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}