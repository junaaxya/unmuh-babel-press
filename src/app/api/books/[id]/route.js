import { prisma } from "@/lib/db";
import { bookSchema } from "@/lib/validation";
import { NextResponse } from "next/server";
import { serializeBigInt } from "@/lib/utils";
import { authorize } from "@/lib/authorize";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      return NextResponse.json({ success: false, message: "Buku tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(serializeBigInt({ success: true, data: book }));
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan saat mengambil data buku" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const authError = await authorize(req);
  if (authError) return authError;
  try {
    const id = Number(params.id);
    const body = await req.json();
    const parsed = bookSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Validasi gagal", errors: parsed.error.flatten() }, { status: 400 });
    }

    const updated = await prisma.book.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(
      serializeBigInt({
        success: true,
        message: "Buku berhasil diperbarui",
        data: updated,
      })
    );
  } catch (error) {
    console.error("PUT /api/books/:id error:", error);
    return NextResponse.json({ success: false, message: "Gagal memperbarui buku" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const authError = await authorize(req);
  if (authError) return authError;
  try {
    const { id } = await params;

    const existing = await prisma.book.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: "Buku tidak ditemukan" }, { status: 404 });
    }

    const deletedBook = await prisma.book.delete({ where: { id } });

    return NextResponse.json(
      serializeBigInt({
        success: true,
        message: "Buku berhasil dihapus",
        data: deletedBook,
      })
    );
  } catch (error) {
    console.error("DELETE /api/books/:id error:", error);
    return NextResponse.json({ success: false, message: "Gagal menghapus buku" }, { status: 500 });
  }
}
