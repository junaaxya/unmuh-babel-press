// src/app/api/books/[id]/route.js

import { prisma } from "@/lib/db";
import { bookSchema } from "@/lib/validation";
import { NextResponse } from "next/server";
import { serializeBigInt } from "@/lib/serialize";
import { authorize } from "@/lib/authorize";

// POLA ALTERNATIF: Menggunakan 'context' dan 'await' secara eksplisit
export async function GET(request, context) {
  try {
    const { params: maybeParams } = context;
    const params = await maybeParams; // Wajib await
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "ID tidak valid" }, { status: 400 });
    }

    const book = await prisma.book.findUnique({ where: { id } });

    if (!book) {
      return NextResponse.json({ success: false, message: "Buku tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(serializeBigInt({ success: true, data: book }));
  } catch (error) {
    console.error("GET /api/books/[id] Error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan saat mengambil data buku" }, { status: 500 });
  }
}

// POLA ALTERNATIF: Menggunakan 'context' dan 'await' secara eksplisit
export async function PUT(req, context) {
  try {
    const { params: maybeParams } = context;
    const params = await maybeParams; // Wajib await
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "ID tidak valid" }, { status: 400 });
    }

    const authError = await authorize(req);
    if (authError) return authError;

    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());

    
    if (body.published_at && typeof body.published_at === 'string') {
      const date = new Date(body.published_at);
      body.published_at = isNaN(date.getTime()) ? null : date;
    } else {
      body.published_at = null;
    }

    const parsed = bookSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Validasi gagal", errors: parsed.error.flatten() }, { status: 400 });
    }
    
    const dataToUpdate = parsed.data;
    delete dataToUpdate.id;
    delete dataToUpdate.created_at;

    const updated = await prisma.book.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(serializeBigInt({ success: true, message: "Buku berhasil diperbarui", data: updated }));
  } catch (error) {
    console.error("PUT /api/books/[id] error:", error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: "Buku yang ingin diperbarui tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: "Gagal memperbarui buku" }, { status: 500 });
  }
}

// POLA ALTERNATIF: Menggunakan 'context' dan 'await' secara eksplisit
export async function DELETE(req, context) {
  try {
    const { params: maybeParams } = context;
    const params = await maybeParams; // Wajib await
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "ID tidak valid" }, { status: 400 });
    }

    const authError = await authorize(req);
    if (authError) return authError;
  
    const existing = await prisma.book.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: "Buku tidak ditemukan" }, { status: 404 });
    }

    const deletedBook = await prisma.book.delete({ where: { id } });

    return NextResponse.json(serializeBigInt({ success: true, message: "Buku berhasil dihapus", data: deletedBook }));
  } catch (error) {
    console.error("DELETE /api/books/[id] error:", error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: "Buku yang ingin dihapus tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: "Gagal menghapus buku" }, { status: 500 });
  }
}