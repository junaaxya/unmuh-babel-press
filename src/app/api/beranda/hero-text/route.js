import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { authorize } from '@/lib/authorize';
import { revalidatePath } from 'next/cache';

const filePath = path.join(process.cwd(), 'src', 'data', 'heroText.json');

// GET - ambil hero text
export async function GET() {
    try {
        const file = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(file);
        return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
    } catch (error) {
        return NextResponse.json(
            { error: 'Gagal membaca hero text' },
            { status: 500, headers: { 'Cache-Control': 'no-store' } }
        );
    }
}

export async function PUT(request) {
    try {
        const authError = await authorize(request);
        if (authError) return authError;

        const { title, subtitle } = await request.json();

        if (!title || !subtitle) {
            return NextResponse.json(
                { error: 'Title dan subtitle wajib diisi' },
                { status: 400 }
            );
        }

        const newData = { title, subtitle };
        await fs.writeFile(filePath, JSON.stringify(newData, null, 2)); // Simpan dengan indentasi

        revalidatePath('/');

        return NextResponse.json(
            { message: 'Hero text berhasil diperbarui', herotext: newData },
            { headers: { 'Cache-Control': 'no-store' } }
        );
    } catch (error) {
        console.error('PUT /api/beranda/hero-text error:', error);
        return NextResponse.json(
            { error: 'Gagal menyimpan hero text' },
            { status: 500, headers: { 'Cache-Control': 'no-store' } }
        );
    }
}
