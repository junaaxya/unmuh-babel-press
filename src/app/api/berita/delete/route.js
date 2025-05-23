import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const judul = searchParams.get("judul");

    if (!judul) {
      return NextResponse.json({ error: "Parameter judul wajib diisi" }, { status: 400 });
    }

    // Cari berita berdasarkan judul
    const beritaExist = await prisma.berita.findUnique({
      where: { judul },
    });

    if (!beritaExist) {
      return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 });
    }

    // Hapus berita
    await prisma.berita.delete({
      where: { judul },
    });

    return NextResponse.json({ message: "Berita berhasil dihapus" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus berita" }, { status: 500 });
  }
}
