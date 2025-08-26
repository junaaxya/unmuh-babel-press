import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { authorize } from "@/lib/authorize";
import { z } from "zod";

const statSchema = z.object({
  number: z.number(),
  label: z.string(),
  suffix: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
});

const heroSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  stats: z.array(statSchema).optional(),
});

export async function GET() {
  try {
    const hero = await prisma.profileHero.findFirst({
      include: { stats: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json({ success: true, data: hero });
  } catch (error) {
    console.error("Error fetching profile hero", error);
    return NextResponse.json({ success: false, message: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request) {
  const authError = await authorize(request, ["ADMIN"]);
  if (authError) return authError;
  try {
    const body = await request.json();
    const data = heroSchema.parse(body);
    const hero = await prisma.profileHero.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        stats: data.stats ? { create: data.stats } : undefined,
      },
      include: { stats: true },
    });
    return NextResponse.json({ success: true, data: hero }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    console.error("Error creating profile hero", error);
    return NextResponse.json({ success: false, message: "Failed to create" }, { status: 500 });
  }
}

export async function PUT(request) {
  const authError = await authorize(request, ["ADMIN"]);
  if (authError) return authError;
  try {
    const body = await request.json();
    const data = heroSchema.partial().parse(body);
    // assume single hero entry
    const existing = await prisma.profileHero.findFirst();
    if (!existing) {
      return NextResponse.json({ success: false, message: "Hero not found" }, { status: 404 });
    }
    const hero = await prisma.profileHero.update({
      where: { id: existing.id },
      data: {
        title: data.title ?? existing.title,
        subtitle: data.subtitle ?? existing.subtitle,
        description: data.description ?? existing.description,
      },
    });
    if (data.stats) {
      // replace stats
      await prisma.profileHeroStat.deleteMany({ where: { heroId: hero.id } });
      await prisma.profileHeroStat.createMany({
        data: data.stats.map((s, idx) => ({
          heroId: hero.id,
          number: s.number,
          label: s.label,
          suffix: s.suffix,
          icon: s.icon,
          order: s.order ?? idx,
        })),
      });
    }
    const updated = await prisma.profileHero.findUnique({
      where: { id: hero.id },
      include: { stats: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    console.error("Error updating profile hero", error);
    return NextResponse.json({ success: false, message: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const authError = await authorize(request, ["ADMIN"]);
  if (authError) return authError;
  try {
    const existing = await prisma.profileHero.findFirst();
    if (!existing) {
      return NextResponse.json({ success: false, message: "Hero not found" }, { status: 404 });
    }
    await prisma.profileHeroStat.deleteMany({ where: { heroId: existing.id } });
    await prisma.profileHero.delete({ where: { id: existing.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting profile hero", error);
    return NextResponse.json({ success: false, message: "Failed to delete" }, { status: 500 });
  }
}
