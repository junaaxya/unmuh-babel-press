//src/app/api/books/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { bookSchema } from "@/lib/validation";
import { serializeBigInt } from "@/lib/serialize";
import { authorize } from "@/lib/authorize";

// GET /api/books
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const kategori = searchParams.get('kategori');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;

    const skip = (page - 1) * limit;

    try {
    // Membangun klausa 'where' dengan lebih aman
        const whereClause = {};

        if (search) {
            // mode: 'insensitive' tidak didukung oleh semua DB, 
            // Prisma biasanya menangani ini secara default untuk MySQL/Postgres.
            whereClause.OR = [
                { title: { contains: search } },
                { penulis: { contains: search } },
                { isbn: { contains: search } },
            ];
        }

        if (kategori) {
            whereClause.kategori = kategori;
        }

        if (status && status !== 'all') {
            whereClause.status = status;
        }
        
        // Menggunakan transaction untuk efisiensi dan akurasi
        const [books, total] = await prisma.$transaction([
            prisma.book.findMany({
                where: whereClause,
                orderBy: { created_at: 'desc' },
                skip: skip,
                take: limit,
            }),
            // Menghitung total berdasarkan filter yang sama
            prisma.book.count({ where: whereClause }),
        ]);

        const total_pages = Math.ceil(total / limit);

        return NextResponse.json(serializeBigInt({
            success: true,
            data: books,
            meta: {
                total,
                page,
                limit,
                total_pages,
            },
        }));

    } catch (error) {
        console.error("GET /api/books error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal mengambil data buku", errors: {} },
            { status: 500 }
        );
    }
}

// POST /api/books
export async function POST(req) {
  // Only ADMIN or EDITOR may add books; VIEWER will be rejected
  const authError = await authorize(req);
  if (authError) return authError;

  try {
    // --- PERBAIKAN ---
    // Mengubah dari req.json() ke req.formData() untuk menangani multipart/form-data
    const formData = await req.formData();

    // Membuat objek dari FormData agar bisa divalidasi oleh Zod
    const body = Object.fromEntries(formData.entries());

    // Zod schema biasanya bisa menangani konversi string ke number,
    // tapi jika ada masalah, Anda bisa lakukan konversi manual di sini.
    // Contoh: if (body.halaman) body.halaman = parseInt(body.halaman, 10);
    
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
    console.error("Error di POST /api/books:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan internal saat menambahkan buku",
        errors: {},
      },
      { status: 500 }
    );
  }
}