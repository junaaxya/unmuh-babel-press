import { prisma } from "@/lib/db";
import { eventSchema } from "@/lib/validation";

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
    const body = await request.json();
    const parsed = eventSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ status: "error", errors: parsed.error.flatten() }, { status: 400 });
    }

    const { title, ...rest } = parsed.data;
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
        date: new Date(parsed.data.date),
        registrationDeadline: parsed.data.registrationDeadline ? new Date(parsed.data.registrationDeadline) : null,
      },
    });

    return Response.json({ status: "success", data: event });
  } catch (err) {
    return Response.json({ status: "error", message: "Server error" }, { status: 500 });
  }
}
