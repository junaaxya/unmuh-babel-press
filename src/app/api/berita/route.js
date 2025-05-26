import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/berita - Mendapatkan semua berita (untuk halaman utama)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const berita = await prisma.berita.findMany({
      select: {
        id: true,
        judul: true,
        thumbnailUrl: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: limit,
    });

    const total = await prisma.berita.count();

    return NextResponse.json({
      success: true,
      data: berita,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching berita:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data berita",
      },
      { status: 500 }
    );
  }
}
