import { NextResponse } from "next/server";
import heroText from "@/data/heroText.json";
import { authorize } from "@/lib/authorize";

export async function GET(request) {
  const authError = await authorize(request);
  if (authError) return authError;
  return NextResponse.json({
    logo: "/uploads/unmuhpress.png",
    heroImage: "/uploads/unmuhpress.png",
    herotext: heroText,
  });
}
