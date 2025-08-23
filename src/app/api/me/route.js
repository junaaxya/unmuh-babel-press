import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { hashPassword, comparePassword } from '@/lib/hash';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, name: true, email: true, role: true, image: true },
    });

    return NextResponse.json(user);
}

export async function PUT(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, currentPassword, newPassword } = await req.json();
    const dataToUpdate = {};

    // 1. Siapkan data nama untuk diupdate jika ada
    if (typeof name === 'string' && name.trim() !== session.user.name) {
        dataToUpdate.name = name.trim();
    }

    // 2. Lakukan validasi dan proses perubahan password jika field terkait diisi
    const isChangingPassword = currentPassword || newPassword;
    if (isChangingPassword) {
        // Pastikan kedua field (lama dan baru) diisi
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { message: 'Password lama dan password baru wajib diisi.' },
                { status: 400 }
            );
        }

        // Validasi panjang password baru
        const PASSWORD_MIN_LENGTH = 8;
        if (newPassword.length < PASSWORD_MIN_LENGTH) {
            return NextResponse.json(
                {
                    message: `Password baru minimal harus ${PASSWORD_MIN_LENGTH} karakter.`,
                },
                { status: 400 }
            );
        }

        // Ambil hash password pengguna dari database
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { hashedPassword: true },
        });

        // Bandingkan password lama yang dimasukkan dengan yang ada di database
        const isCurrentPasswordValid = await comparePassword(
            currentPassword,
            user?.hashedPassword || ''
        );
        if (!isCurrentPasswordValid) {
            return NextResponse.json(
                { message: 'Password Anda saat ini salah.' },
                { status: 400 }
            );
        }

        // -- VALIDASI BARU DITAMBAHKAN DI SINI --
        // Pastikan password baru tidak sama dengan password lama
        if (currentPassword === newPassword) {
            return NextResponse.json(
                {
                    message:
                        'Password baru tidak boleh sama dengan password lama.',
                },
                { status: 400 }
            );
        }

        // Hash password baru sebelum disimpan
        dataToUpdate.hashedPassword = await hashPassword(newPassword);
    }

    // 3. Jika tidak ada data yang perlu diubah, kembalikan respons
    if (Object.keys(dataToUpdate).length === 0) {
        return NextResponse.json({
            message: 'Tidak ada perubahan yang disimpan.',
        });
    }

    // 4. Update data pengguna di database
    await prisma.user.update({
        where: { id: session.user.id },
        data: dataToUpdate,
    });

    return NextResponse.json({ message: 'Profile updated successfully' });
}
