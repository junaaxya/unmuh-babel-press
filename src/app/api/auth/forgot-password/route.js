import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';
import { Resend } from 'resend';
import PasswordResetEmail from '@/components/emails/PasswordResetEmail.jsx';
import { applyRateLimit } from '@/lib/rateLimit';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const rateLimitResponse = await applyRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: 'Email wajib diisi' }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  // Selalu balas ok untuk mencegah enumerasi email
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

  await prisma.passwordResetToken.deleteMany({ where: { email: normalizedEmail } });
  await prisma.passwordResetToken.create({
    data: { email: normalizedEmail, token, expires },
  });

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const resetLink = `${baseUrl}/admin/reset-password/${token}`;
  const fromName = process.env.MAIL_FROM_NAME;
  const fromEmail = process.env.MAIL_FROM_EMAIL;

  if (fromName && fromEmail) {
    await resend.emails.send({
      from: `"${fromName}" <${fromEmail}>`,
      to: normalizedEmail,
      subject: 'Reset Password',
      react: PasswordResetEmail({ resetLink }),
    });
  }

  return NextResponse.json({ ok: true });
}

