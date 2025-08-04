import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/authorize";

export async function PUT(req, { params }) {
  const authError = await authorize(req);
  if (authError) return authError;
  const { id } = await params;

  try {
    const existingNews = await prisma.news.findUnique({
      where: { id: Number(id) },
    });

    if (!existingNews) {
      return NextResponse.json(
        {
          success: false,
          message: "Berita dengan ID tersebut tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const news = await prisma.news.update({
      where: { id: Number(id) },
      data: {
        status: "draft",
        published_at: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Berita berhasil di-unpublish",
      data: {
        id: news.id,
        status: news.status,
        published_at: news.published_at,
      },
    });
  } catch (error) {
    console.error("Error unpublishing book:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal meng-unpublish berta",
        errors: {},
      },
      { status: 500 }
    );
  }
}
