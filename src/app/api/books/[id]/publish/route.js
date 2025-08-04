import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { serializeBigInt } from "@/lib/utils";
import { authorize } from "@/lib/authorize";

export async function PUT(req, { params }) {
  const authError = await authorize(req);
  if (authError) return authError;
  const { id } = await params;

  try {
    const existingBook = await prisma.book.findUnique({
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
    const book = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        status: "published",
        published_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Buku berhasil dipublish",
      data: serializeBigInt({
        id: book.id,
        status: book.status,
        published_at: book.published_at,
      }),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mempublish buku",
        errors: {},
      },
      { status: 500 }
    );
  }
}
