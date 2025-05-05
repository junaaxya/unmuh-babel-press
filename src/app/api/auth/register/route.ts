import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { error } from "console";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../../../lib/email";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    //Validasi form inputan
    if (!name || !email || !password) {
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
    const existingUser = await prisma.user.findUnique({
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

    const newUSer = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
        emailVerified: false,
        verificationToken: token,
        verificationTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    await sendVerificationEmail(email, token);

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
