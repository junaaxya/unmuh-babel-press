import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { authorize } from "@/lib/authorize";

export async function GET(request, { params }) {
  const id = parseInt(params.id);

  const news = await prisma.news.findUnique({
    where: { id },
  });

  if (!news) {
    return Response.json({ status: "error", message: "Berita tidak ditemukan" }, { status: 404 });
  }

  return Response.json({ status: "success", data: news });
}

export async function PUT(request, { params }) {
  const authError = await authorize(request);
  if (authError) return authError;
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    if (body.title) {
      body.slug =
        body.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "") +
        "-" +
        Date.now();
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        ...body,
        date: new Date(body.date),
      },
    });

    return NextResponse.json({
      status: "success",
      data: updatedNews,
    });
  } catch (error) {
    console.error("PUT /api/news/[id] error:", error);
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const authError = await authorize(request);
  if (authError) return authError;
  const id = parseInt(params.id);

  await prisma.news.delete({ where: { id } });

  return Response.json({
    status: "success",
    message: "Berita berhasil dihapus",
  });
}
