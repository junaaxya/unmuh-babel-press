// lib/authorize.js
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/authjose";

export async function authorize(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Token tidak ditemukan" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    await verifyToken(token);
    return null; // Tidak ada error
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
  }
}
