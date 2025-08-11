// app/sections/section3book/section3.js
'use client';

import { useState, useEffect } from 'react';
import BookCarousel from '@/components/carousel/BookCarousel';
import SectionHeading from '@/components/common/SectionHeading';
import { motion } from 'framer-motion';
import { getBooks } from '@/app/services/api.books';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

export default function Section3Book() {
    // state untuk menyimpan buku, loading, dan error
    const [randomBooks, setRandomBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    //  untuk mengambil data dari API saat komponen dimuat
    useEffect(() => {
        const fetchRandomBooks = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // buku terbaru yang sudah dipublikasikan sebagai "buku acak"
                const response = await getBooks({ status: 'published', limit: 8 });
                setRandomBooks(response.data || []);
            } catch (err) {
                console.error("Gagal mengambil buku unggulan:", err);
                setError("Tidak dapat memuat buku saat ini.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRandomBooks();
    }, []); // Array dependensi kosong agar hanya berjalan sekali

    // Fungsi untuk menampilkan konten berdasarkan state
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center py-10">
                    <FontAwesomeIcon icon={faSpinner} className="text-3xl text-blue-500 animate-spin" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-10 text-red-500">
                    <FontAwesomeIcon icon={faExclamationCircle} className="text-3xl mb-2" />
                    <p>{error}</p>
                </div>
            );
        }

        if (randomBooks.length === 0) {
            return (
                <div className="text-center py-10 text-gray-500">
                    <p>Belum ada buku yang tersedia saat ini.</p>
                </div>
            );
        }

        return <BookCarousel books={randomBooks} autoplay />;
    };

    return (
        <section className="w-full py-16 px-4 md:px-12 lg:px-24">
            <div className="max-w-screen-xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <SectionHeading
                        title="Buku Unggulan"
                        subtitle="Pilihan Buku Terbaik untuk Mahasiswa dan Profesional"
                    />
                </motion.div>

                {/*carousel (atau status loading/error) secara dinamis */}
                <div className="mt-10">
                    {renderContent()}
                </div>
            </div>
        </section>
    );
}
