'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function BookCard({ id, title, subtitle, image, lazy = false }) {
    return (
        <motion.article
            className="relative w-full max-w-xs flex-shrink-0 bg-white shadow-md rounded-2xl overflow-hidden transition-transform hover:scale-105 hover:shadow-lg group mx-auto"
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
            <div className="relative h-60 w-full bg-gray-100">
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

            {/* Konten */}
            <div className="p-4 space-y-1">
                <h3
                    id={`book-title-${id}`}
                    className="text-base font-bold text-blue-900 line-clamp-2"
                >
                    {title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">{subtitle}</p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-2 w-full text-sm text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition-colors"
                >
                    Lihat Detail
                </motion.button>
            </div>
        </motion.article>
    );
}
