import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { authorize } from "@/lib/authorize";

async function getParams(context) {
  const { params: maybeParams } = await context;
  return await maybeParams; // ini yang mencegah error Next.js
}

export async function GET(request, context) {
  const params = await getParams(context);
  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json(
      { status: "error", message: "ID tidak valid" },
      { status: 400 }
    );
  }

  const news = await prisma.news.findUnique({ where: { id } });
  if (!news) {
    return NextResponse.json(
      { status: "error", message: "Berita tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json({ status: "success", data: news });
}

export async function PUT(request, context) {
  const params = await getParams(context);
  const authError = await authorize(request);
  if (authError) return authError;

  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json(
      { status: "error", message: "ID tidak valid" },
      { status: 400 }
    );
  }

  try {
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

    return NextResponse.json({ status: "success", data: updatedNews });
  } catch (error) {
    console.error("PUT /api/news/[id] error:", error);
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  const params = await getParams(context);
  const authError = await authorize(request);
  if (authError) return authError;

  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json(
      { status: "error", message: "ID tidak valid" },
      { status: 400 }
    );
  }

  await prisma.news.delete({ where: { id } });

  return NextResponse.json({
    status: "success",
    message: "Berita berhasil dihapus",
  });
}
