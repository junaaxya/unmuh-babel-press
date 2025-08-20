import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { authorize } from "@/lib/authorize";

export async function PUT(req, context) {
  const authError = await authorize(req);
  if (authError) return authError;
  const { params: maybeParams } = context;
  const { id } = await maybeParams;

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
        status: "published",
        published_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Berita berhasil dipublish",
      data: {
        id: news.id,
        status: news.status,
        published_at: news.published_at,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mempublish berita",
        errors: {},
      },
      { status: 500 }
    );
  }
}
