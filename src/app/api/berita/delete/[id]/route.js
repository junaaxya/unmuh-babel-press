import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  const url = new URL(request.url);
  const id = parseInt(url.pathname.split("/").pop());
  try {
    if (!id) {
      return NextResponse.json({ error: `Berita dengan id=${id} tidak ditemukan` }, { status: 400 });
    }

    // Cari berita berdasarkan judul
    const beritaExist = await prisma.berita.findUnique({
      where: { id },
    });

    if (!beritaExist) {
      return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 });
    }

    // Hapus berita
    await prisma.berita.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Berita berhasil dihapus" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus berita" }, { status: 500 });
  }
}
