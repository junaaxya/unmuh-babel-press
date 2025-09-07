// src/app/api/events/slug/[slug]/route.js
import { prisma } from "@/lib/db";
import { serializeBigInt } from "@/lib/serialize";

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
    const event = await prisma.event.findUnique({ where: { slug } });

    if (!event) {
      return Response.json(
        {
          status: "error",
          message: "Event dengan slug ini tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return Response.json(serializeBigInt({ status: "success", data: event }));
  } catch (err) {
    console.error("GET /api/events/slug/[slug] error:", err);
    return Response.json(
      { status: "error", message: "Gagal mengambil event" },
      { status: 500 }
    );
  }
}
