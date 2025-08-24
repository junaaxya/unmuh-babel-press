import { NextResponse } from 'next/server';

import { hashPassword } from '@/lib/hash';
import { prisma } from '@/lib/db';

const PASSWORD_MIN_LENGTH = Number(process.env.PASSWORD_MIN_LENGTH ?? 8);

export async function POST(request) {
    const { token, name, password } = await request.json();
    if (!password || password.length < PASSWORD_MIN_LENGTH) {
        return NextResponse.json(
            {
                error: `Kata sandi harus minimal ${PASSWORD_MIN_LENGTH} karakter`,
            },
            { status: 400 }
        );
    }

    const invite = await prisma.invitation.findUnique({ where: { token } });
    if (!invite || invite.expires < new Date()) {
        return NextResponse.json(
            { error: 'Token tidak valid atau sudah kedaluwarsa' },
            { status: 400 }
        );
    }

    const user = await prisma.user.findUnique({
        where: { email: invite.email },
    });
    if (!user || user.status !== 'INVITED') {
        return NextResponse.json(
            { error: 'Pengguna tidak ditemukan atau undangan tidak valid' },
            { status: 400 }
        );
    }
    const hashed = await hashPassword(password);
    await prisma.user.update({
        where: { email: invite.email },
        data: { name, hashedPassword: hashed, status: 'ACTIVE' },
    });
    await prisma.invitation.delete({ where: { token } });

    return NextResponse.json({ ok: true });
}
