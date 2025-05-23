
// ✅ src/app/api/books/addBooks/route.js

import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";


export async function POST(req) {
  try {
    const { email, password } = await req.json();

    //Validasi form inputan
    if (!email || !password) {
      return NextResponse.json({ error: "Form tidak boleh kosong !" }, { status: 400 });
    }

    //cek password
    if (password.length < 8) {
      return NextResponse.json({ error: "Panjang password kurang dari 8 karakter" }, { status: 400 });
    }
    //cek format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 });
    }
    // cek email sudah terdaftar atau belum
    const existingUser = await prisma.admin.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "Email sudah terdaftar",
          suggestion: "Gunakan email lain atau reset password",
        },
        { status: 400 }
      );
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUSer = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = newUSer;
    console.log(newUSer);
    return NextResponse.json({
      message: "Registrasi berhasil",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server. Silakan coba lagi nanti." }, { status: 500 });
  }
}
