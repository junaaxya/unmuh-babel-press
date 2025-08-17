import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { serialize } from "cookie";

export async function POST(req) {
  // Pindahkan pengecekan ke dalam fungsi ini
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET tidak terdefinisi di environment variables");
    return NextResponse.json(
      { error: "Konfigurasi server tidak lengkap." },
      { status: 500 }
    );
  }

  try {
    const { email, password } = await req.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 });
    }

    // Cari admin berdasarkan email
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json({ error: "Email tidak ditemukan" }, { status: 404 });
    }

    // Cek password cocok atau tidak
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    // Generate token JWT menggunakan jose
    const secret = new TextEncoder().encode(jwtSecret); // Gunakan variabel yang sudah dicek
    const token = await new SignJWT({ id: admin.id, email: admin.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(secret);

    const serialized = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
    });

    // Return token
    const response = NextResponse.json({
      message: "Login berhasil",
      admin: { id: admin.id, email: admin.email },
    });

    response.headers.set("Set-Cookie", serialized);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
