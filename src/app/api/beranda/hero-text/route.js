import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { verifyToken } from "@/lib/authjose";
const filePath = path.join(process.cwd(), "src", "data", "heroText.json");

// GET - ambil hero text
export async function GET() {
  try {
    const file = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(file);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Gagal membaca hero text" }, { status: 500 });
  }
}

// PUT - update hero text
export async function PUT(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token tidak ditemukan" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];

    await verifyToken(token);

    const body = await request.json();
    const { title, subtitle } = body;

    if (!title || !subtitle) {
      return NextResponse.json({ error: "Title dan subtitle wajib diisi" }, { status: 400 });
    }

    const newData = { title, subtitle };
    await fs.writeFile(filePath, JSON.stringify(newData, null, 2)); // Simpan dengan indentasi

    return NextResponse.json({ message: "Hero text berhasil diperbarui" });
  } catch (error) {
    console.error("PUT /api/beranda/hero-text error:", error);
    return NextResponse.json({ error: "Gagal menyimpan hero text" }, { status: 500 });
  }
}
