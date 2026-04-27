// src/app/api/books/lookup/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const isbn = searchParams.get('isbn');

  if (!isbn) {
    return NextResponse.json(
      { success: false, message: 'ISBN wajib diisi' },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const cleanIsbn = isbn.trim().replace(/[-\s]/g, '');

  try {
    // Coba 3 strategi query secara berurutan sampai ada yang berhasil
    const queries = [
      `isbn:${cleanIsbn}`,
      `isbn:${cleanIsbn}&intitle=`,
      cleanIsbn,
    ];

    let items = null;

    for (const q of queries) {
      const url = apiKey
        ? `https://www.googleapis.com/books/v1/volumes?q=${q}&key=${apiKey}`
        : `https://www.googleapis.com/books/v1/volumes?q=${q}`;

      console.log('[Google Books] Fetching:', url);

      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();

      console.log('[Google Books] totalItems:', data.totalItems);

      if (data.items && data.items.length > 0) {
        items = data.items;
        break;
      }
    }

    if (!items) {
      return NextResponse.json(
        { success: false, message: `Buku dengan ISBN ${isbn} tidak ditemukan di Google Books` },
        { status: 404 }
      );
    }

    const info = items[0].volumeInfo;

    return NextResponse.json({
      success: true,
      data: {
        title:       info.title || '',
        penulis:     info.authors ? info.authors.join(', ') : '',
        penerbit:    info.publisher || '',
        halaman:     info.pageCount || '',
        sinopsis:    info.description || '',
        kategori:    info.categories ? info.categories[0] : '',
        image:       info.imageLinks?.thumbnail?.replace('http://', 'https://') || '',
        published_at: info.publishedDate || '',
      },
    });
  } catch (error) {
    console.error('[Google Books] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghubungi Google Books API' },
      { status: 500 }
    );
  }
}