import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const books = await prisma.Book.findMany({
      select: { kategori: true },
    });

    const kategoriSet = new Set();

    books.forEach((book) => {
      const kategori = book.kategori || "Tanpa Kategori";
      kategoriSet.add(kategori);
    });

    const result = Array.from(kategoriSet);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data kategori",
        errors: { server: [error.message] },
      },
      { status: 500 }
    );
  }
}
