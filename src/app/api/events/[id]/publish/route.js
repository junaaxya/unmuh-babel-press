import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { serializeBigInt } from "@/lib/utils";
import { authorize } from "@/lib/authorize";

export async function PUT(req, { params }) {
  const authError = await authorize(req);
  if (authError) return authError;
  const { id } = await params;

  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id: Number(id) },
    });

    if (!existingEvent) {
      return NextResponse.json(
        {
          success: false,
          message: "Even dengan ID tersebut tidak ditemukan",
        },
        { status: 404 }
      );
    }
    const event = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        publishStatus: "published",
        published_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Event berhasil di-publish",
      data: serializeBigInt({
        id: event.id,
        publshStatus: event.publishStatus,
        published_at: event.published_at,
      }),
    });
  } catch (error) {
    console.error("Error publishing event:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal publish event",
        errors: {},
      },
      { status: 500 }
    );
  }
}
