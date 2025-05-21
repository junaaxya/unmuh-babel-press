import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  cookieStore.set("admin-token", "", {
    httpOnly: true,
    expires: new Date(0), // buat kadaluarsa langsung
  });

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  return NextResponse.redirect(new URL("/admin/login", baseUrl));
}
