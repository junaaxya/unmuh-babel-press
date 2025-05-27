import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware untuk API routes dan halaman login
  if (pathname.startsWith("/api") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Proteksi route admin
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("token")?.value;

    // Jika tidak ada token, redirect ke login
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      // Verifikasi token
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      // Jika token tidak valid, hapus cookie dan redirect ke login
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.set("token", "", {
        expires: new Date(0),
        path: "/",
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
