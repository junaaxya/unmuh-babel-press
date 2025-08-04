import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { bookSchema } from "@/lib/validation";
import { serializeBigInt } from "@/lib/utils";
import { authorize } from "@/lib/authorize";

// GET /api/books
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const kategori = searchParams.get("kategori");
    const status = searchParams.get("status") || "published";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where = {
      AND: [
        search
          ? {
              OR: [{ title: { contains: search, mode: "insensitive" } }, { penulis: { contains: search, mode: "insensitive" } }, { isbn: { contains: search, mode: "insensitive" } }],
            }
          : {},
        kategori ? { kategori } : {},
        status !== "all" ? { status } : {},
      ],
    };

    const total = await prisma.book.count();

    const books = await prisma.book.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: "desc" },
    });

    const result = serializeBigInt({
      success: true,
      data: books,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Terjadi kesalahan saat GET /api/books:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data buku",
        errors: {},
      },
      { status: 500 }
    );
  }
}

// POST /api/books
export async function POST(req) {
  const authError = await authorize(request);
  if (authError) return authError;
  try {
    const body = await req.json();
    const parsed = bookSchema.safeParse(body);

    if (!parsed.success) {
      const errorMap = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          message: "Validasi gagal",
          errors: errorMap,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const newBook = await prisma.book.create({
      data: {
        ...data,
        status: data.status || "draft",
        published_at: data.status === "published" && !data.published_at ? new Date() : data.published_at || null,
      },
    });

    return NextResponse.json(
      serializeBigInt({
        success: true,
        message: "Buku berhasil ditambahkan",
        data: newBook,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat menambahkan buku",
        errors: {},
      },
      { status: 500 }
    );
  }
}
