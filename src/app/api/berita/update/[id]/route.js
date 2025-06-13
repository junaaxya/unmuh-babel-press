import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { authorize } from "@/lib/authorize";
import { z } from "zod";

const updateBeritaSchema = z
  .object({
    judul: z.string().min(5).optional(),
    isi: z.string().min(10).optional(),
    thumbnailUrl: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Minimal satu field harus diisi untuk update",
  });
export async function PUT(request) {
  const authError = await authorize(request);
  if (authError) return authError;
  const url = new URL(request.url);
  const id = parseInt(url.pathname.split("/").pop());
  try {
    const body = await request.json();
    const { judul, isi, thumbnailUrl } = updateBeritaSchema.parse(body);

    // Validasi ID
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const validatedData = updateBeritaSchema.parse(body);
    // Cari berita berdasarkan id
    const beritaExist = await prisma.berita.findUnique({
      where: { id },
    });

    if (!beritaExist) {
      return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 });
    }

    const updateData = {};
    if (validatedData.judul !== undefined) {
      updateData.judul = validatedData.judul;
    }

    if (validatedData.isi !== undefined) {
      updateData.isi = validatedData.isi;
    }

    if (validatedData.thumbnailUrl !== undefined) {
      updateData.thumbnailUrl = validatedData.thumbnailUrl === "" || validatedData.thumbnailUrl === null ? null : validatedData.thumbnailUrl;
    }

    // Update berita
    const updatedBerita = await prisma.$transaction(async (tx) => {
      return await tx.berita.update({
        where: { id },
        data: updateData,
      });
    });

    return NextResponse.json({ message: "Berita berhasil diperbarui", data: updatedBerita }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validasi gagal", detail: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Gagal memperbarui berita" }, { status: 500 });
  }
}
