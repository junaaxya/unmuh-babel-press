// src/app/(main)/buku/[id]/page.js

import React from 'react';
import { getBookById } from '@/app/services/api';
import BookDetailView from './BookDetailView';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faExclamationCircle,
    faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

// --- Komponen Halaman Utama (Server Component) ---
export default async function BookDetailPage({ params }) {
    const { id } = await params;
    try {
        const response = await getBookById(id);
        const book = response.data;

        if (!book || book.status !== 'published') {
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

        // ── Schema.org JSON-LD ─────────────────────────────────────────────
        // Ditambahkan untuk Google Search & Google Books indexing otomatis
        const siteUrl = process.env.NEXTAUTH_URL || 'https://unmuhbabelpress.ac.id';
        const schemaData = {
            '@context': 'https://schema.org',
            '@type': 'Book',
            name: book.title,
            author: {
                '@type': 'Person',
                name: book.penulis || 'Unmuh Babel Press',
            },
            publisher: {
                '@type': 'Organization',
                name: book.penerbit || 'Unmuh Babel Press',
                url: siteUrl,
            },
            isbn: book.isbn || '',
            numberOfPages: book.halaman || '',
            description: book.sinopsis || '',
            image: book.image || '',
            url: `${siteUrl}/buku/${book.id}`,
            inLanguage: 'id',
            bookFormat: 'https://schema.org/Paperback',
            datePublished: book.published_at
                ? new Date(book.published_at).toISOString().split('T')[0]
                : '',
        };
        // ──────────────────────────────────────────────────────────────────

        return (
            <>
                {/* Schema.org JSON-LD — dibaca Google untuk indexing otomatis */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
                />
                {/* Komponen Klien dengan data buku */}
                <BookDetailView book={book} />
            </>
        );
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
export async function generateMetadata({ params }) {
    try {
        const { id } = await params;
        const response = await getBookById(id);
        const book = response.data;

        if (!book || book.status !== 'published') {
            return { title: 'Buku Tidak Ditemukan' };
        }

        const siteUrl = process.env.NEXTAUTH_URL || 'https://unmuhbabelpress.ac.id';

        return {
            title: `${book.title} | Unmuh Press`,
            description:
                book.sinopsis?.substring(0, 160) ||
                `Detail lengkap buku ${book.title}`,
            // ── Tambahan metadata untuk Google ──────────────────────────
            keywords: [
                book.title,
                book.penulis,
                book.penerbit,
                book.isbn,
                book.kategori,
                'Unmuh Babel Press',
                'buku',
            ]
                .filter(Boolean)
                .join(', '),
            // ─────────────────────────────────────────────────────────────
            openGraph: {
                title: `${book.title} | Unmuh Press`,
                description:
                    book.sinopsis?.substring(0, 160) ||
                    `Detail lengkap buku ${book.title}`,
                images: [{ url: book.image }],
                type: 'book',
                // ── Tambahan OpenGraph untuk Google Books ────────────────
                url: `${siteUrl}/buku/${book.id}`,
                siteName: 'Unmuh Babel Press',
                // ─────────────────────────────────────────────────────────
            },
        };
    } catch (error) {
        return {
            title: 'Error Memuat Buku',
            description: 'Gagal memuat detail buku.',
        };
    }
}