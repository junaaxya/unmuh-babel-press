import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const judul = searchParams.get("judul")?.toLowerCase() || "";

    const hasil = await prisma.berita.findMany({
      where: {
        judul: {
          contains: judul,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (hasil.length === 0) {
      return NextResponse.json({ message: "Berita tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(hasil);
  } catch (error) {
    return NextResponse.json({ error: "Error saat mencari berita" }, { status: 500 });
  }
}
