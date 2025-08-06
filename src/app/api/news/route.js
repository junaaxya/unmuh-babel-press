import { prisma } from "@/lib/db";
import { newsSchema } from "@/lib/validation";
import { authorize } from "@/lib/authorize";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || null;
  const dateFilter = searchParams.get("date_filter") || "all";
  
  // --- PERUBAHAN 1: Baca parameter 'status' ---
  const status = searchParams.get("status") || null;

  const skip = (page - 1) * limit;

  const where = {
    AND: [
      {
        OR: [{ title: { contains: search } }, { excerpt: { contains: search } }, { author: { contains: search } }],
      },
      category ? { category } : {},
      dateFilter !== "all"
        ? {
            date: {
              gte: getDateRange(dateFilter),
            },
          }
        : {},
      // --- PERUBAHAN 2: Terapkan filter 'status' jika ada ---
      status ? { status } : {},
    ],
  };

  const [items, totalItems] = await Promise.all([
    prisma.news.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: "desc" },
    }),
    prisma.news.count({ where }),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return Response.json({
    status: "success",
    data: {
      items,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_items: totalItems,
        items_per_page: limit,
      },
    },
  });
}

function getDateRange(filter) {
  const now = new Date();
  switch (filter) {
    case "today":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "week":
      now.setDate(now.getDate() - 7);
      return now;
    case "month":
      now.setMonth(now.getMonth() - 1);
      return now;
    default:
      return new Date(0);
  }
}

export async function POST(request) {
  const authError = await authorize(request);
  if (authError) return authError;
  try {
    const body = await request.json();

    const parsed = newsSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          status: "error",
          message: "Validasi gagal",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { title, status, published_at } = parsed.data;

    const baseSlug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const slug = `${baseSlug}-${Date.now()}`;

    const news = await prisma.news.create({
      data: {
        ...parsed.data,
        slug,
        status: status || "draft",
        published_at: status === "published" && !published_at ? new Date() : published_at || null,
      },
    });

    return Response.json({
      status: "success",
      data: news,
    });
  } catch (error) {
    console.error("POST /api/news error:", error);
    return Response.json({ status: "error", message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
