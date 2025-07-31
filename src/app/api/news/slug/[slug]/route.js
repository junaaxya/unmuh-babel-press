import { prisma } from "@/lib/db";

export async function GET(request, context) {
  const { slug } = context.params;

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
}
