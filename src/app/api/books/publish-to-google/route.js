// src/app/api/books/publish-to-google/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authorize } from '@/lib/authorize';

export async function POST(request) {
  const authError = await authorize(request);
  if (authError) return authError;

  try {
    const { bookId } = await request.json();

    if (!bookId) {
      return NextResponse.json(
        { success: false, message: 'bookId wajib diisi' },
        { status: 400 }
      );
    }

    // Ambil data buku dari database
    const book = await prisma.book.findUnique({
      where: { id: BigInt(bookId) },
    });

    if (!book) {
      return NextResponse.json(
        { success: false, message: 'Buku tidak ditemukan' },
        { status: 404 }
      );
    }

    if (book.status !== 'published') {
      return NextResponse.json(
        { success: false, message: 'Buku harus dipublish dulu sebelum didaftarkan ke Google Books' },
        { status: 400 }
      );
    }

    if (!book.isbn) {
      return NextResponse.json(
        { success: false, message: 'Buku harus memiliki ISBN untuk didaftarkan ke Google Books' },
        { status: 400 }
      );
    }

    // Cek apakah sudah pernah didaftarkan
    if (book.google_books_url) {
      return NextResponse.json({
        success: true,
        message: 'Buku ini sudah terdaftar di Google Books',
        google_books_url: book.google_books_url,
        status: 'linked',
      });
    }

    // Cari buku di Google Books berdasarkan ISBN
    const cleanIsbn = book.isbn.replace(/[-\s]/g, '');
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}${apiKey ? `&key=${apiKey}` : ''}`;
    
    const searchRes = await fetch(searchUrl, { cache: 'no-store' });
    const searchData = await searchRes.json();

    if (searchData.items && searchData.items.length > 0) {
      // Buku sudah ada di Google Books — simpan linknya
      const volumeId = searchData.items[0].id;
      const googleBooksUrl = `https://books.google.com/books?id=${volumeId}`;

      // Update database
      await prisma.book.update({
        where: { id: BigInt(bookId) },
        data: { google_books_url: googleBooksUrl },
      });

      return NextResponse.json({
        success: true,
        message: 'Buku ditemukan dan berhasil ditautkan ke Google Books!',
        google_books_url: googleBooksUrl,
        status: 'linked',
      });
    } else {
      // Buku belum ada di Google Books — arahkan ke Partner Center
      return NextResponse.json({
        success: true,
        message: 'Buku belum ada di Google Books. Silakan upload PDF di Partner Center.',
        status: 'pending',
        book_data: {
          title: book.title,
          isbn: book.isbn,
          penulis: book.penulis,
          penerbit: book.penerbit,
          sinopsis: book.sinopsis?.substring(0, 500),
        },
      });
    }

  } catch (error) {
    console.error('Publish to Google Books error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memproses permintaan', error: error.message },
      { status: 500 }
    );
  }
}