// File: src/app/api/event/[id]/publish/route.js

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { authorize } from "@/lib/authorize";

export async function PUT(req, { params }) {
  const authError = await authorize(req);
  if (authError) return authError;
  const { id } = params;

  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id: Number(id) },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, message: "Event dengan ID tersebut tidak ditemukan" },
        { status: 404 }
      );
    }

    const event = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        // --- PERBAIKAN KRITIS ---
        // Ubah 'publishStatus', bukan 'status'
        publishStatus: "published", 
        published_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Event berhasil dipublish",
      data: {
        id: event.id,
        publishStatus: event.publishStatus,
        published_at: event.published_at,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal mempublish event" },
      { status: 500 }
    );
  }
}