import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeBigInt } from "@/lib/utils";
import { authorize } from "@/lib/authorize";

export async function PUT(req, context) {
  const authError = await authorize(req);
  if (authError) return authError;
  const { params: maybeParams } = context;
  const { id } = await maybeParams;

  try {
    const existingBook = await prisma.Book.findUnique({
      where: { id: Number(id) },
    });

    if (!existingBook) {
      return NextResponse.json(
        {
          success: false,
          message: "Buku dengan ID tersebut tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const book = await prisma.Book.update({
      where: { id: Number(id) },
      data: {
        status: "draft",
        published_at: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Buku berhasil di-unpublish",
      data: serializeBigInt({
        id: book.id,
        status: book.status,
        published_at: book.published_at,
      }),
    });
  } catch (error) {
    console.error("Error unpublishing book:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal meng-unpublish buku",
        errors: {},
      },
      { status: 500 }
    );
  }
}
