// app/api/admin/logout/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));

    // Hapus semua cookie auth
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ success: false, message: "Gagal logout" }, { status: 500 });
  }
}
