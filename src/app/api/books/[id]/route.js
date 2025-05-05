import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

// GET detail buku by ID
export async function GET(_, { params }) {
  try {
    const book = await prisma.listBuku.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!book) return NextResponse.json({ error: "Buku tidak ditemukan" }, { status: 404 });
    return NextResponse.json(book);
  } catch {
    return NextResponse.json({ error: "Gagal mengambil detail buku" }, { status: 500 });
  }
}

// PUT update buku by ID
export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const { judul, penulis, penerbit, tahunTerbit, kategori, deskripsi, coverUrl } = body;

    const updated = await prisma.listBuku.update({
      where: { id: parseInt(params.id) },
      data: { judul, penulis, penerbit, tahunTerbit, kategori, deskripsi, coverUrl },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui buku" }, { status: 500 });
  }
}

// DELETE buku by ID
export async function DELETE(_, context) {
  const { params } = context;

  try {
    const idBuku = Number(params.id);

    if (isNaN(idBuku)) {
      return NextResponse.json(
        {
          sukses: false,
          pesan: "ID buku harus berupa angka",
          kodeError: "ID_INVALID",
        },
        { status: 400 }
      );
    }

    const bukuYangAda = await prisma.listBuku.findUnique({
      where: { id: idBuku },
    });

    if (!bukuYangAda) {
      return NextResponse.json(
        {
          sukses: false,
          pesan: "Buku tidak ditemukan",
          kodeError: "BUKU_TIDAK_ADA",
        },
        { status: 404 }
      );
    }

    await prisma.listBuku.delete({
      where: { id: idBuku },
    });

    return NextResponse.json(
      {
        sukses: true,
        pesan: "Buku berhasil dihapus",
        idBukuYangDihapus: idBuku,
        dataBuku: bukuYangAda, // Opsional: kembalikan data buku yang dihapus
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal menghapus buku:", error);

    return NextResponse.json(
      {
        sukses: false,
        pesan: "Terjadi kesalahan saat menghapus buku",
        kodeError: "KESALAHAN_SERVER",
        detail: process.env.NODE_ENV === "development" ? error.message : null,
      },
      { status: 500 }
    );
  }
}
