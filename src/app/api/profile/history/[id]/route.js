import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { authorize } from "@/lib/authorize";
import { z } from "zod";

const historySchema = z.object({
  year: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  order: z.number().optional(),
});

export async function PUT(request, { params }) {
  const authError = await authorize(request, ["ADMIN"]);
  if (authError) return authError;
  try {
    const body = await request.json();
    const data = historySchema.parse(body);
    const item = await prisma.profileHistory.update({
      where: { id: Number(params.id) },
      data,
    });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    console.error("Error updating history", error);
    return NextResponse.json({ success: false, message: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const authError = await authorize(request, ["ADMIN"]);
  if (authError) return authError;
  try {
    await prisma.profileHistory.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting history", error);
    return NextResponse.json({ success: false, message: "Failed to delete" }, { status: 500 });
  }
}
