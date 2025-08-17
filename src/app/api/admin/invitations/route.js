import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { email, role } = await request.json();
  const lowerEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({ where: { email: lowerEmail } });
  const existingInvite = await prisma.invitation.findUnique({ where: { email: lowerEmail } });
  if (existingUser || existingInvite) {
    return NextResponse.json({ error: 'Email already used' }, { status: 400 });
  }

  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);
  await prisma.invitation.create({ data: { email: lowerEmail, role, token, expires } });

  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  if (settings?.smtpHost && settings?.smtpUser && settings?.smtpPass && settings?.fromEmail) {
    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort || 587,
      secure: false,
      auth: { user: settings.smtpUser, pass: settings.smtpPass },
    });
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const url = `${baseUrl}/accept-invitation?token=${token}`;
    await transporter.sendMail({
      from: `${settings.fromName || settings.fromEmail} <${settings.fromEmail}>`,
      to: lowerEmail,
      subject: 'User Invitation',
      text: `Anda diundang untuk bergabung. Silakan atur kata sandi: ${url}`,
    });
  }

  return NextResponse.json({ ok: true });
}

