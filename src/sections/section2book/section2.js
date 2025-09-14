// app/sections/section2book/section2.js
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/button/Button';
import { faArrowRight, faSpinner, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BookCarousel } from '@/components/carousel';
import SectionHeading from '@/components/common/SectionHeading';
import { getBooks } from '@/app/services/api';

export default function Section2Books() {
    const [monthlyBooks, setMonthlyBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMonthlyBooks = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Ambil 50 buku terbaru yang sudah dipublikasikan
                const response = await getBooks({ status: 'published', limit: 50 });
                const allRecentBooks = response.data || [];

                // Filter buku-buku untuk bulan ini di sisi klien
                const today = new Date();
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();

                const booksThisMonth = allRecentBooks.filter(book => {
                    if (!book.published_at) return false;
                    const publishedDate = new Date(book.published_at);
                    return publishedDate.getMonth() === currentMonth && publishedDate.getFullYear() === currentYear;
                });

                setMonthlyBooks(booksThisMonth);

            } catch (err) {
                console.error("Gagal mengambil buku bulan ini:", err);
                setError("Tidak dapat memuat buku saat ini.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMonthlyBooks();
    }, []);

    return (
        <section className="py-16 px-4 bg-white ">
            <div className="max-w-7xl mx-auto space-y-10">
                <motion.h2
                    className="text-3xl font-bold text-center text-blue-800"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <SectionHeading
                        title="Buku Terbit Bulan Ini"
                        subtitle="Buku yang di terbitkan & di publish bulan ini"
                    />
                </motion.h2>

                <div className="flex flex-col-reverse md:flex-row items-center md:items-start ">
                    <motion.div
                        className="w-full md:w-64 text-center md:text-left mb-8 md:mb-0 md:mt-32 md:ml-4 mt-8"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="text-2xl font-bold text-blue-800 mb-4">
                            Buku-Buku Terbaru
                        </h3>
                        <Link href="/catalog" passHref>
      <Button icon={faArrowRight} variant="primary">
        Buku lainnya
      </Button>
    </Link>
                    </motion.div>

                    {/* 3. Tampilkan konten secara dinamis berdasarkan status */}
                    <div className="flex-1 w-full overflow-x-hidden">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <FontAwesomeIcon icon={faSpinner} className="text-3xl text-blue-500 animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="flex justify-center items-center h-64 text-red-500">
                                <FontAwesomeIcon icon={faExclamationCircle} className="text-3xl mr-4" />
                                <p>{error}</p>
                            </div>
                        ) : monthlyBooks.length > 0 ? (
                            <BookCarousel books={monthlyBooks} autoplay />
                        ) : (
                            <div className="flex justify-center items-center h-64 text-gray-500">
                                <p>Belum ada buku yang terbit bulan ini.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
