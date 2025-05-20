'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
export default function BookCard({ id, title, kategori, image, lazy = false }) {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);

    // Fungsi untuk mengarahkan ke halaman detail buku
    const handleViewDetail = async () => {
        try {
            setIsNavigating(true);
            await router.push(`/buku/${id}`);
        } catch (error) {
            console.error('Navigation failed:', error);
            setIsNavigating(false);
        }
    };

    return (
        <motion.article
            className="relative w-[260px] max-w-xs flex-shrink-0 bg-white shadow-md rounded-2xl overflow-hidden transition-transform hover:scale-105 hover:shadow-lg group mx-auto"
            role="group"
            aria-labelledby={`book-title-${id}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Badge "Baru" */}
            <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                Baru
            </div>

            {/* Gambar Buku */}
            <div className="flex justify-center items-center bg-gray-100 ">
                <div className="relative h-[350px] w-[250px] bg-gray-100">
                    <Image
                        src={image}
                        alt={`Cover buku ${title}`}
                        fill
                        sizes="(max-width: 768px) 90vw, 250px"
                        className="object-cover object-top"
                        priority={!lazy}
                        loading={lazy ? 'lazy' : 'eager'}
                    />
                </div>
            </div>

            {/* Konten */}
            <div className="p-4 space-y-1">
                <h3
                    id={`book-title-${id}`}
                    className="text-base font-bold text-blue-900 line-clamp-2"
                >
                    {title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">{kategori}</p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleViewDetail}
                    disabled={isNavigating}
                    aria-label={`Lihat detail buku ${title}`}
                    className={`mt-2 w-full text-sm text-white ${
                        isNavigating
                            ? 'bg-blue-500'
                            : 'bg-blue-700 hover:bg-blue-800'
                    } px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                    {isNavigating ? 'Memuat...' : 'Lihat Detail'}
                </motion.button>
            </div>
        </motion.article>
    );
}
