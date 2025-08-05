import { NextResponse } from "next/server";
import heroText from "@/data/heroText.json";

export async function GET(request) {
  return NextResponse.json({
    logo: "/uploads/logo.png",
    heroImage: "/uploads/hero-image.png",
    herotext: heroText,
  });
}
