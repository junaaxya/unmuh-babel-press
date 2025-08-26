import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { authorize } from "@/lib/authorize";
import { z } from "zod";

const historySchema = z.object({
  year: z.string(),
  title: z.string(),
  description: z.string(),
  order: z.number().optional(),
});

export async function GET() {
  try {
    const items = await prisma.profileHistory.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Error fetching history", error);
    return NextResponse.json({ success: false, message: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request) {
  const authError = await authorize(request, ["ADMIN"]);
  if (authError) return authError;
  try {
    const body = await request.json();
    const data = historySchema.parse(body);
    const item = await prisma.profileHistory.create({ data });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    console.error("Error creating history", error);
    return NextResponse.json({ success: false, message: "Failed to create" }, { status: 500 });
  }
}
