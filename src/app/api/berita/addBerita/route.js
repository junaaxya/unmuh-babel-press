import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const beritaSchema = z.object({
  judul: z.string().min(5),
  isi: z.string().min(10),
  thumbnailUrl: z.string().optional(),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const validated = beritaSchema.parse(body);

    const berita = await prisma.berita.create({
      data: validated,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Berita berhasil dibuat",
        data: berita,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validasi gagal", detail: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Gagal tambah berita" }, { status: 500 });
  }
}
