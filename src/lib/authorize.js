import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/authjose";
import { cookies } from "next/headers";

export async function authorize(request) {
  let token = null;

  // 1. Coba ambil dari Authorization header
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2. Kalau header kosong, coba ambil dari cookie
  if (!token) {
    const cookieStore = await cookies(); // Next.js native cookie reader
    token = cookieStore.get("token")?.value;
  }

  // 3. Kalau tetap tidak ada token, tolak akses
  if (!token) {
    return NextResponse.json({ error: "Token tidak ditemukan" }, { status: 401 });
  }

  // 4. Verifikasi token
  try {
    await verifyToken(token);
    return null; // sukses
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
  }
}
