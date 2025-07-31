/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Ambil daftar berita
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Halaman saat ini
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Jumlah item per halaman
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Kata kunci untuk mencari judul, excerpt, atau penulis
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter berdasarkan kategori
 *       - in: query
 *         name: date_filter
 *         schema:
 *           type: string
 *           enum: [today, week, month, all]
 *         description: Filter berdasarkan tanggal berita
 *     responses:
 *       200:
 *         description: Daftar berita berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/News'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         current_page:
 *                           type: integer
 *                         total_pages:
 *                           type: integer
 *                         total_items:
 *                           type: integer
 *                         items_per_page:
 *                           type: integer
 *
 *   post:
 *     summary: Buat berita baru
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewsInput'
 *     responses:
 *       200:
 *         description: Berita berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/News'
 *       400:
 *         description: Validasi gagal
 *       500:
 *         description: Terjadi kesalahan pada server
 */

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

    // Validasi body
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

    const { title } = parsed.data;

    const baseSlug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const slug = `${baseSlug}-${Date.now()}`;

    const news = await prisma.news.create({
      data: {
        ...parsed.data,
        slug,
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
