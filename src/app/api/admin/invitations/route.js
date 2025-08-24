// src/app/api/admin/invitations/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import crypto from 'crypto';
import { Resend } from 'resend';
import { prisma } from '@/lib/db';
import InvitationEmail from '@/components/emails/InvitationEmail'; // Pastikan template email diimpor

// Inisialisasi Resend di luar fungsi
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const invites = await prisma.invitation.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(invites);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { email, role } = await request.json();
    const normalizedEmail = email.trim().toLowerCase();

    // Logika untuk mencegah duplikasi pengguna aktif
    const activeUser = await prisma.user.findFirst({
      where: { email: normalizedEmail, status: 'ACTIVE' },
    });
    if (activeUser) {
      return NextResponse.json({ error: 'Pengguna aktif dengan email ini sudah ada.' }, { status: 400 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Transaksi database untuk memastikan konsistensi data
    await prisma.$transaction(async (tx) => {
      await tx.invitation.deleteMany({ where: { email: normalizedEmail } });
      await tx.user.deleteMany({ where: { email: normalizedEmail, status: 'INVITED' } });
      await tx.user.create({ data: { email: normalizedEmail, role, status: 'INVITED' } });
      await tx.invitation.create({ data: { email: normalizedEmail, token, expires } });
    });

    // --- Bagian Pengiriman Email yang Diperbaiki ---
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const link = `${baseUrl}/accept-invitation/${token}`;

    const adminUser = session.user;

    // MENGGUNAKAN NAMA VARIABEL YANG BENAR SESUAI .env ANDA
    const fromName = process.env.MAIL_FROM_NAME;
    const fromEmail = process.env.MAIL_FROM_EMAIL;

    // Validasi untuk memastikan variabel .env ada
    if (!fromEmail || !fromName) {
      throw new Error("MAIL_FROM_EMAIL atau MAIL_FROM_NAME tidak diatur di file .env");
    }

    await resend.emails.send({
      from: `"${fromName}" <${fromEmail}>`,
      to: normalizedEmail,
      subject: `Undangan untuk Bergabung dengan Unmuh Babel Press`,
      // Menggunakan template email React yang modern
      react: InvitationEmail({
        invitationLink: link,
        invitedBy: adminUser.name || 'Admin',
        invitedByImage: adminUser.image || 'https://unmuhbabelpress.com/default-avatar.png', // Sediakan URL gambar default
        invitedByRole: adminUser.role,
        role: role.toLowerCase(),
      }),
    });
    

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Gagal mengirim undangan:', error);
    if (error instanceof Error) {
        return NextResponse.json({ error: `Gagal mengirim email: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Terjadi kesalahan internal.' }, { status: 500 });
  }
}