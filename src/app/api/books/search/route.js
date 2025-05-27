import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Ambil parameter pencarian
    const title = searchParams.get("title")?.toLowerCase() || undefined;
    const penulis = searchParams.get("penulis")?.toLowerCase() || undefined;
    const kategori = searchParams.get("kategori") || undefined;
    const tahunMin = searchParams.get("tahun_min");
    const tahunMax = searchParams.get("tahun_max");

    // Query database dengan filter
    const books = await prisma.listbuku.findMany({
      where: {
        title: title
          ? {
              contains: title,
              // Hapus `mode: 'insensitive'` untuk Prisma v6.6.0
            }
          : undefined,
        penulis: penulis
          ? {
              contains: penulis,
            }
          : undefined,
        kategori: kategori ? { equals: kategori } : undefined,
        tahunTerbit: {
          gte: tahunMin ? parseInt(tahunMin) : undefined,
          lte: tahunMax ? parseInt(tahunMax) : undefined,
        },
      },
      orderBy: { title: "asc" },
    });

    if (books.length === 0) {
      return NextResponse.json({ message: "Tidak ada buku yang ditemukan" }, { status: 404 });
    }

    return NextResponse.json(books);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Gagal melakukan pencarian", details: error.message }, { status: 500 });
  }
}
