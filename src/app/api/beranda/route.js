import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";

const filePath = path.join(process.cwd(), "src", "data", "heroText.json");

export async function GET() {
  try {
    const siteSettingPromise = prisma.siteSetting.findUnique({ where: { id: 1 } });
    const homeContentPromise = prisma.homeContent
      ? prisma.homeContent.findUnique({ where: { id: 1 } })
      : Promise.resolve(null);

    const [fileResult, siteSettingResult, homeContentResult] = await Promise.allSettled([
      fs.readFile(filePath, "utf-8"),
      siteSettingPromise,
      homeContentPromise,
    ]);

    let heroText = { title: "", subtitle: "" };
    if (fileResult.status === "fulfilled") {
      try {
        heroText = JSON.parse(fileResult.value);
      } catch (e) {
        console.error("Failed to parse heroText.json:", e);
      }
    }

    return NextResponse.json(
      {
        logo:
          siteSettingResult.status === "fulfilled"
            ? siteSettingResult.value?.logoUrl || null
            : null,
        heroImage:
          homeContentResult.status === "fulfilled"
            ? homeContentResult.value?.heroImageUrl || null
            : null,
        herotext: heroText,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("GET /api/beranda error:", error);
    return NextResponse.json(
      { error: "Gagal membaca data beranda" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
