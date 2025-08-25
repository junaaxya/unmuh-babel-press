import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/hash';
import { applyRateLimit } from '@/lib/rateLimit';

const PASSWORD_MIN_LENGTH = Number(process.env.PASSWORD_MIN_LENGTH ?? 8);

export async function POST(request) {
  const rateLimitResponse = await applyRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const { token, password, confirmPassword } = await request.json();
  if (!token || !password || !confirmPassword) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Konfirmasi kata sandi tidak cocok' }, { status: 400 });
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return NextResponse.json(
      { error: `Kata sandi harus minimal ${PASSWORD_MIN_LENGTH} karakter` },
      { status: 400 }
    );
  }

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.expires < new Date()) {
    return NextResponse.json({ error: 'Token tidak valid atau telah kedaluwarsa' }, { status: 400 });
  }

  const hashed = await hashPassword(password);
  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { email: record.email }, data: { hashedPassword: hashed } });
    await tx.passwordResetToken.delete({ where: { token } });
  });

  return NextResponse.json({ ok: true });
}

