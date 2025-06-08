import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/authorize";
import { z } from "zod";

const bookSchema = z.object({
  Kode_Buku: z.string().min(3, "Kode Buku minimal 3 karakter"),
  ISBN: z.string().min(10, "ISBN minimal 10 karakter"),
  Penerbit: z.string().min(2, "Penerbit minimal 2 karakter"),
  Penulis: z.string().min(3, "Penulis minimal 3 karakter"),
  Editor: z.string().min(3, "Editor minimal 3 karakter"),
  Ukuran: z.string().min(2, "Ukuran minimal 2 karakter"),
  Halaman: z.number().int().min(1, "Halaman minimal 1"),
  image: z.string().url("URL tidak valid"),
  kategori: z.string().min(3, "Kategori minimal 3 karakter"),
  sinopsis: z.string().max(1000, "Sinopsis maksimal 1000 karakter"),
});

export async function POST(request) {
  const authError = await authorize(request);
  if (authError) return authError;
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
