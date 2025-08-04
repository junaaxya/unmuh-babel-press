// src/app/api/news/slug/[slug]/route.js
import { prisma } from "@/lib/db";

async function getParams(context) {
  const { params: maybeParams } = await context;
  return await maybeParams;
}

export async function GET(request, context) {
  const params = await getParams(context);
  const slug = String(params.slug || "").trim();

  if (!slug) {
    return Response.json(
      { status: "error", message: "Slug tidak boleh kosong" },
      { status: 400 }
    );
  }

  try {
    const news = await prisma.news.findUnique({ where: { slug } });

    if (!news) {
      return Response.json(
        {
          status: "error",
          message: "Berita dengan slug ini tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return Response.json({ status: "success", data: news });
  } catch (err) {
    console.error("GET /api/news/slug/[slug] error:", err);
    return Response.json(
      { status: "error", message: "Gagal mengambil berita" },
      { status: 500 }
    );
  }
}
