import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { serialize } from "cookie";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET tidak terdefinisi di environment variables");
}

export async function POST(req) {
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

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Email tidak ditemukan" }, { status: 404 });
    }

    // Cek password cocok atau tidak
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    // Generate token JWT menggunakan jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ id: user.id, email: user.email }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1d").sign(secret);

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
      user: { id: user.id, email: user.email },
    });

    response.headers.set("Set-Cookie", serialized);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
