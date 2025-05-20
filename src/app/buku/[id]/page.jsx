'use client';

import React, { use, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import dummyBooks from '@/data/dummyBooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarAlt,
    faShare,
    faLink,
    faArrowLeft,
    faBook,
} from '@fortawesome/free-solid-svg-icons';
import {
    faFacebookF,
    faTwitter,
    faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';

const BookDetail = ({ params }) => {
    // Use React.use() to unwrap the params Promise
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;
    const [activeTab, setActiveTab] = useState('spesifikasi');

    const book = dummyBooks.find((book) => book.id === parseInt(id));

    if (!book) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-600">
                    Buku tidak ditemukan atau sedang dimuat...
                </p>
            </div>
        );
    }

    const formattedDate = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <>
            <Head>
                <title>{book.title} | UnMuh Press</title>
                <meta
                    name="description"
                    content={book.sinopsis?.substring(0, 160)}
                />
            </Head>

            <div className="bg-gray-50 min-h-screen py-12">
                <div className="container mx-auto px-4">
                    <Link
                        href="/catalog"
                        className="inline-flex items-center text-blue-600 mb-6 hover:underline"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Kembali ke Katalog
                    </Link>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="md:flex">
                            <div className="md:w-1/3 p-6 flex items-center justify-center bg-gray-100">
                                <div className="relative w-64 h-80">
                                    {book.image ? (
                                        <Image
                                            src={book.image}
                                            alt={book.title}
                                            width={500}
                                            height={400}
                                            className="object-contain"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                            <FontAwesomeIcon
                                                icon={faBook}
                                                className="text-5xl text-gray-400"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="md:w-2/3 p-6">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                                    {book.title}
                                </h1>
                                <div className="flex items-center text-gray-500 mb-6">
                                    <FontAwesomeIcon
                                        icon={faCalendarAlt}
                                        className="mr-2"
                                    />
                                    <span>{formattedDate}</span>
                                </div>

                                {/* Tabs */}
                                <div className="border-b border-gray-200 mb-6">
                                    <div className="flex -mb-px">
                                        <button
                                            onClick={() =>
                                                setActiveTab('spesifikasi')
                                            }
                                            className={`mr-6 py-2 border-b-2 font-medium ${
                                                activeTab === 'spesifikasi'
                                                    ? 'border-blue-600 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            Spesifikasi
                                        </button>
                                        <button
                                            onClick={() =>
                                                setActiveTab('sinopsis')
                                            }
                                            className={`py-2 border-b-2 font-medium ${
                                                activeTab === 'sinopsis'
                                                    ? 'border-blue-600 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            Sinopsis
                                        </button>
                                    </div>
                                </div>

                                {/* Tab Content */}
                                {activeTab === 'spesifikasi' && (
                                    <div className="space-y-4">
                                        {book.Kode_Buku &&
                                            book.Kode_Buku !== '-' && (
                                                <div className="flex">
                                                    <span className="text-gray-600 w-32">
                                                        Kode buku:
                                                    </span>
                                                    <span className="text-gray-800 font-medium">
                                                        {book.Kode_Buku}
                                                    </span>
                                                </div>
                                            )}
                                        <div className="flex">
                                            <span className="text-gray-600 w-32">
                                                Judul:
                                            </span>
                                            <span className="text-gray-800 font-medium">
                                                {book.title}
                                            </span>
                                        </div>
                                        {book.ISBN && book.ISBN !== '-' && (
                                            <div className="flex">
                                                <span className="text-gray-600 w-32">
                                                    ISBN:
                                                </span>
                                                <span className="text-gray-800 font-medium">
                                                    {book.ISBN}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex">
                                            <span className="text-gray-600 w-32">
                                                Penerbit:
                                            </span>
                                            <span className="text-gray-800 font-medium">
                                                {book.Penerbit}
                                            </span>
                                        </div>
                                        <div className="flex">
                                            <span className="text-gray-600 w-32">
                                                Penulis:
                                            </span>
                                            <span className="text-gray-800 font-medium">
                                                {book.Penulis}
                                            </span>
                                        </div>
                                        {book.Editor && book.Editor !== '-' && (
                                            <div className="flex">
                                                <span className="text-gray-600 w-32">
                                                    Editor:
                                                </span>
                                                <span className="text-gray-800 font-medium">
                                                    {book.Editor}
                                                </span>
                                            </div>
                                        )}
                                        {book.Ukuran && book.Ukuran !== '-' && (
                                            <div className="flex">
                                                <span className="text-gray-600 w-32">
                                                    Ukuran:
                                                </span>
                                                <span className="text-gray-800 font-medium">
                                                    {book.Ukuran}
                                                </span>
                                            </div>
                                        )}
                                        {book.Halaman && (
                                            <div className="flex">
                                                <span className="text-gray-600 w-32">
                                                    Halaman:
                                                </span>
                                                <span className="text-gray-800 font-medium">
                                                    {book.Halaman}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'sinopsis' && (
                                    <div className="prose max-w-none">
                                        <p className="text-gray-700 leading-relaxed">
                                            {book.sinopsis ||
                                                'Sinopsis belum tersedia untuk buku ini.'}
                                        </p>
                                    </div>
                                )}

                                {/* Share buttons */}
                                <div className="mt-8">
                                    <p className="text-gray-600 mb-3">
                                        Bagikan Melalui:
                                    </p>
                                    <div className="flex gap-2">
                                        <button className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700">
                                            <FontAwesomeIcon
                                                icon={faFacebookF}
                                                size="sm"
                                            />
                                        </button>
                                        <button className="w-8 h-8 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500">
                                            <FontAwesomeIcon
                                                icon={faTwitter}
                                                size="sm"
                                            />
                                        </button>
                                        <button className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600">
                                            <FontAwesomeIcon
                                                icon={faWhatsapp}
                                                size="sm"
                                            />
                                        </button>
                                        <button className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300">
                                            <FontAwesomeIcon
                                                icon={faLink}
                                                size="sm"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookDetail;
