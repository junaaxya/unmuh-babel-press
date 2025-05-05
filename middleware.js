import { NextResponse } from "next/server";
import { verifyToken } from "./src/app/lib/auth";

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("admin-token")?.value;

  // Proteksi semua route admin kecuali login
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await verifyToken(token);
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("admin-token");
      return response;
    }
  }

  return NextResponse.next();
}
