import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { authorize } from "@/lib/authorize";
// Fungsi untuk menyimpan file upload
async function saveFile(file, filename) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);
}

//fungsi updload logo
export async function POST(request) {
  const authError = await authorize(request);
  if (authError) return authError;
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    await saveFile(file, "logo.png");
    return NextResponse.json({ message: "Logo uploaded" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// Fungsi untuk menghapus logo
export async function DELETE(request) {
  const authError = await authorize(request);
  if (authError) return authError;
  const filePath = path.join(process.cwd(), "public", "uploads", "logo.png");

  try {
    await fs.unlink(filePath);
    return NextResponse.json({ message: "Logo deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Deletion failed or file not found" }, { status: 500 });
  }
}
