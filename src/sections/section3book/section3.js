'use client';

import BookCarousel from '@/components/carousel/BookCarousel';
import SectionHeading from '@/components/common/SectionHeading';
import { motion } from 'framer-motion';
import dummyBooks from '@/data/dummyBooks';

export default function Section3Book() {
    return (
        <section className="w-full py-16 px-4 md:px-12 lg:px-24">
            <div className="max-w-screen-xl mx-auto">
                <motion.h2
                    className="text-3xl font-bold text-center text-blue-800"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <SectionHeading
                        title="Best Books"
                        subtitle="Pilihan Buku Terbaik untuk Mahasiswa dan Profesional"
                    />
                </motion.h2>

                <BookCarousel books={dummyBooks} autoplay />
            </div>
        </section>
    );
}
