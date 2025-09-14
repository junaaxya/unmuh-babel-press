import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";

const filePath = path.join(process.cwd(), "src", "data", "heroText.json");

export async function GET() {
  try {
    const [file, siteSetting, homeContent] = await Promise.all([
      fs.readFile(filePath, "utf-8"),
      prisma.siteSetting.findUnique({ where: { id: 1 } }),
      prisma.homeContent.findUnique({ where: { id: 1 } }),
    ]);
    const heroText = JSON.parse(file);

    return NextResponse.json(
      {
        logo: siteSetting?.logoUrl || null,
        heroImage: homeContent?.heroImageUrl || null,
        herotext: heroText,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal membaca hero text" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
