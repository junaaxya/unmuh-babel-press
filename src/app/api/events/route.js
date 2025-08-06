import { prisma } from "@/lib/db";
import { eventSchema } from "@/lib/validation";
import { authorize } from "@/lib/authorize";

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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const dateFilter = searchParams.get("date_filter") || "all";

  const skip = (page - 1) * limit;

  const where = {
    AND: [
      {
        OR: [{ title: { contains: search } }, { excerpt: { contains: search } }, { organizer: { contains: search } }],
      },
      category ? { category } : {},
      status ? { status } : {},
      dateFilter !== "all" ? { date: { gte: getDateRange(dateFilter) } } : {},
    ],
  };

  const [items, totalItems] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: "desc" },
    }),
    prisma.event.count({ where }),
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

// ============ POST =========
export async function POST(request) {
  const authError = await authorize(request);
  if (authError) return authError;

  try {
    let body = await request.json();

    // --- START OF BACKEND FIX ---
    // Logika ini membuat validasi lebih cerdas dan fleksibel.
    // Jika registrasi tidak diaktifkan (false), kita pastikan field terkait
    // diatur ke null atau nilai default yang sesuai SEBELUM divalidasi.
    if (!body.registrationEnabled) {
      body.registrationTitle = "";
      body.registrationDescription = "";
      body.registrationButtonText = "";
      body.registrationLink = null; // Kirim null agar sesuai dengan skema DB
      body.registrationDeadline = null; // Kirim null agar sesuai dengan skema DB
    }
    // --- END OF BACKEND FIX ---

    const parsed = eventSchema.safeParse(body);

    if (!parsed.success) {
      // Error dari Zod akan ditangkap di sini
      return Response.json({ status: "error", errors: parsed.error.flatten() }, { status: 400 });
    }

    const { title, published_at, publishStatus, ...rest } = parsed.data;

    // Buat slug yang unik
    const slug =
      title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "") + `-${Date.now()}`;

    const event = await prisma.event.create({
      data: {
        ...rest,
        title,
        slug,
        // Pastikan konversi tanggal dilakukan dengan benar
        date: new Date(parsed.data.date),
        // Konversi deadline hanya jika ada nilainya
        registrationDeadline: parsed.data.registrationDeadline ? new Date(parsed.data.registrationDeadline) : null,
        publishStatus: publishStatus || "draft",
        published_at: publishStatus === "published" && !published_at ? new Date() : published_at || null,
      },
    });

    return Response.json({ status: "success", data: event }, { status: 201 }); // Gunakan status 201 Created
  } catch (err) {
    console.error("EVENT POST ERROR:", err); // Log error untuk debugging
    return Response.json({ status: "error", message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
