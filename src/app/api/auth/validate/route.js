import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/authjose";

export async function GET(request) {
  try {
    const token = request.cookies.get("token");

    if (!token) {
      return NextResponse.json({ isAuthenticated: false, error: "Token tidak ditemukan" }, { status: 401 });
    }

    // Verifikasi token
    const decoded = await verifyToken(token.value);

    return NextResponse.json({
      isAuthenticated: true,
      admin: {
        id: decoded.id,
        email: decoded.email,
      },
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json({ isAuthenticated: false, error: "Token tidak valid" }, { status: 401 });
  }
}
