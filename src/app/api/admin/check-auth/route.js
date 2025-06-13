import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(request) {
  const token = request.cookies.get("admin-token")?.value;

  if (!token) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }

  try {
    verifyToken(token);
    return NextResponse.json({ isAuthenticated: true });
  } catch {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}
