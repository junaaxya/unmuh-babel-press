import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const invites = await prisma.invitation.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(invites);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { email, role } = await request.json();
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
  }
  const existingInvite = await prisma.invitation.findUnique({ where: { email: normalizedEmail } });
  if (existingInvite) {
    return NextResponse.json({ error: 'Invitation already sent' }, { status: 400 });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.user.create({ data: { email: normalizedEmail, role, status: 'INVITED' } });
  await prisma.invitation.create({ data: { email: normalizedEmail, token, expires } });

  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  if (settings?.smtpHost && settings?.smtpPort && settings?.smtpUser && settings?.smtpPass) {
    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort,
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPass,
      },
    });
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const link = `${baseUrl}/accept-invitation/${token}`;
    await transporter.sendMail({
      from: settings.fromEmail || settings.smtpUser,
      to: normalizedEmail,
      subject: 'You are invited',
      text: `Please complete your account: ${link}`,
    });
  }

  return NextResponse.json({ ok: true });
}

