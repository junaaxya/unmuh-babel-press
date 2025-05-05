import { PrismaClient } from "@prisma/client";
import { error } from "console";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) return NextResponse.json({ error: "Token tidak ditemukan" }, { status: 400 });

  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await prisma.user.update({
      where: { email: payload.email },
      data: { emailVerified: true, verificationToken: null, verificationTokenExpiresAt: null },
    });
    return NextResponse.json({ message: "email berhasil diverifikasi", user });
  } catch (error) {
    return NextResponse.json({ error: "Token tidak valid atau sudah kadaluarsa" }, { status: 400 });
  }
}
