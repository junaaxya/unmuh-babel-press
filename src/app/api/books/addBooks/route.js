import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const bookSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  penulis: z.string().min(3),
  penerbit: z.string().min(2),
  tahunTerbit: z.number().int().min(1900).max(new Date().getFullYear()),
  kategori: z.string().optional(),
  sinopsis: z.string().max(500).optional(),
  coverUrl: z.string().optional(),
});

export async function POST(request) {
  try {
    const body = await request.json();

    // Validasi input
    const validatedData = bookSchema.parse(body);

    // Tambah buku ke database
    const newBook = await prisma.listbuku.create({
      data: validatedData,
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Input tidak valid", details: error.errors }, { status: 400 });
    }
    console.error("Error:", error);
    return NextResponse.json({ error: "Gagal menambahkan buku" }, { status: 500 });
  }
}
