// src/app/api/admin/invitations/resend/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import crypto from 'crypto';
import { Resend } from 'resend';
import { prisma } from '@/lib/db';
import InvitationEmail from '@/components/emails/InvitationEmail';
import { applyRateLimit } from '@/lib/rateLimit';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const rateLimitResponse = await applyRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { email } = await request.json();
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Email tidak valid' }, { status: 400 });
    }

    const invitation = await prisma.invitation.findUnique({ where: { email: normalizedEmail } });
    if (!invitation) {
      return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || user.status !== 'INVITED') {
      return NextResponse.json({ error: 'Pengguna sudah aktif atau tidak ada' }, { status: 400 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.invitation.update({ where: { email: normalizedEmail }, data: { token, expires } });

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const link = `${baseUrl}/accept-invitation/${token}`;

    const adminUser = session.user;

    const fromName = process.env.MAIL_FROM_NAME;
    const fromEmail = process.env.MAIL_FROM_EMAIL;
    if (!fromEmail || !fromName) {
      throw new Error('MAIL_FROM_EMAIL atau MAIL_FROM_NAME tidak diatur di file .env');
    }

    await resend.emails.send({
      from: `"${fromName}" <${fromEmail}>`,
      to: normalizedEmail,
      subject: `Undangan untuk Bergabung dengan Unmuh Babel Press`,
      react: InvitationEmail({
        invitationLink: link,
        invitedBy: adminUser.name || 'Admin',
        invitedByImage: adminUser.image || 'https://unmuhbabelpress.com/default-avatar.png',
        invitedByRole: adminUser.role,
        role: user.role.toLowerCase(),
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Gagal mengirim ulang undangan:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Gagal mengirim email: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Terjadi kesalahan internal.' }, { status: 500 });
  }
}

