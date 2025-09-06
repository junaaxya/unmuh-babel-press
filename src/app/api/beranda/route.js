import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "src", "data", "heroText.json");

export async function GET() {
  try {
    const file = await fs.readFile(filePath, "utf-8");
    const heroText = JSON.parse(file);

    return NextResponse.json(
      {
        logo: "/uploads/logo.png",
        heroImage: "/uploads/hero-image.png",
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
