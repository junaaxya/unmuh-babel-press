// src/app/(main)/buku/[id]/page.js

import React from 'react';
import { getBookById } from '@/app/services/api.books';
import BookDetailView from './BookDetailView'; // Impor komponen klien
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faExclamationCircle,
    faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

// --- Komponen Halaman Utama (Server Component) ---
// Ini adalah komponen default yang diekspor. Ia berjalan di server.
export default async function BookDetailPage({ params }) {
    try {
        const response = await getBookById(params.id);
        const book = response.data;

        if (!book) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
                    <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="text-5xl text-red-500 mb-4"
                    />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Buku Tidak Ditemukan
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Buku yang Anda cari tidak ada atau telah dihapus.
                    </p>
                    <Link
                        href="/catalog"
                        className="inline-flex items-center text-blue-600 hover:underline"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Kembali ke Katalog
                    </Link>
                </div>
            );
        }

        // Merender komponen Klien dan memberikan data buku sebagai prop
        return <BookDetailView book={book} />;
    } catch (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
                <FontAwesomeIcon
                    icon={faExclamationCircle}
                    className="text-5xl text-red-500 mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Gagal Memuat Buku
                </h2>
                <p className="text-gray-600 mb-6">
                    {error.message ||
                        'Terjadi kesalahan saat mengambil data buku.'}
                </p>
                <Link
                    href="/catalog"
                    className="inline-flex items-center text-blue-600 hover:underline"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Kembali ke Katalog
                </Link>
            </div>
        );
    }
}

// --- Fungsi generateMetadata (Server Function) ---
// Fungsi ini sekarang bisa diekspor karena file ini adalah Server Component.
export async function generateMetadata({ params }) {
    try {
        const response = await getBookById(params.id);
        const book = response.data;

        if (!book) {
            return { title: 'Buku Tidak Ditemukan' };
        }
        return {
            title: `${book.title} | Unmuh Press`,
            description:
                book.sinopsis?.substring(0, 160) ||
                `Detail lengkap buku ${book.title}`,
            openGraph: {
                title: `${book.title} | Unmuh Press`,
                description:
                    book.sinopsis?.substring(0, 160) ||
                    `Detail lengkap buku ${book.title}`,
                images: [{ url: book.image }],
            },
        };
    } catch (error) {
        return {
            title: 'Error Memuat Buku',
            description: 'Gagal memuat detail buku.',
        };
    }
}
