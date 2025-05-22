import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET semua buku
export async function GET() {
  try {
    const books = await prisma.listbuku.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (books.length === 0) {
      return NextResponse.json({ message: "Tidak ada buku yang ditemukan" }, { status: 404 });
    }
    return NextResponse.json(books);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data buku" }, { status: 500 });
  }
}
