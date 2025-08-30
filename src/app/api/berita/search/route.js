import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/rateLimit";

export async function GET(request) {
  const rateLimitResponse = await applyRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    if (!q) {
      return NextResponse.json([]);
    }

    const hasil = await prisma.news.findMany({
      where: {
        status: "published",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(hasil);
  } catch (error) {
    console.error("News search error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
