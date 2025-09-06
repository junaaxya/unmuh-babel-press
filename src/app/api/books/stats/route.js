import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Hitung total buku
    const totalBooks = await prisma.Book.count();

    // Hitung buku yang published
    const publishedBooks = await prisma.Book.count({
      where: { status: "published" },
    });

    // Hitung buku yang masih draft
    const draftBooks = await prisma.Book.count({
      where: { status: "draft" },
    });

    // Hitung 5 buku yang terakhir dipublish
    const recentPublished = await prisma.Book.findMany({
      where: { status: "published" },
      orderBy: { published_at: "desc" },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      data: {
        total_books: totalBooks,
        published_books: publishedBooks,
        draft_books: draftBooks,
        recent_published: recentPublished.length,
      },
    });
  } catch (error) {
    console.error("Error fetching book stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil statistik buku",
        errors: {
          server: [error.message],
        },
      },
      { status: 500 }
    );
  }
}
