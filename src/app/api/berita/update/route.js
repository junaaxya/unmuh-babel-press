import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateBeritaSchema = z.object({
  judul: z.string().min(5).optional(),
  isi: z.string().min(10).optional(),
  thumbnailUrl: z.string().optional(),
});

export async function PUT(request) {
  try {
    const body = await request.json();
    const { judul, isi, thumbnailUrl } = updateBeritaSchema.parse(body);

    // Cari berita berdasarkan judul
    const beritaExist = await prisma.berita.findUnique({
      where: { judul },
    });

    if (!beritaExist) {
      return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 });
    }

    // Update berita
    const updatedBerita = await prisma.berita.update({
      where: { judul },
      data: { isi, thumbnailUrl },
    });

    return NextResponse.json({ message: "Berita berhasil diperbarui", data: updatedBerita }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validasi gagal", detail: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Gagal memperbarui berita" }, { status: 500 });
  }
}
