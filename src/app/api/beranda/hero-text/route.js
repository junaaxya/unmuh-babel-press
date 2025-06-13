import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { authorize } from '@/lib/authorize';
import { verifyToken } from '@/lib/authjose';
const filePath = path.join(process.cwd(), 'src', 'data', 'heroText.json');

// GET - ambil hero text
export async function GET() {
    try {
        const file = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(file);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Gagal membaca hero text' },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const authError = await authorize(request);
        if (authError) return authError;

        const body = await request.json();
        console.log('PUT body:', body);
        const { title, subtitle } = body;

        if (!title || !subtitle) {
            return NextResponse.json(
                { error: 'Title dan subtitle wajib diisi' },
                { status: 400 }
            );
        }

        const newData = { title, subtitle };
        await fs.writeFile(filePath, JSON.stringify(newData, null, 2)); // Simpan dengan indentasi

        return NextResponse.json({ message: 'Hero text berhasil diperbarui' });
    } catch (error) {
        console.error('PUT /api/beranda/hero-text error:', error);
        return NextResponse.json(
            { error: 'Gagal menyimpan hero text' },
            { status: 500 }
        );
    }
}
