'use client';

import { motion } from 'framer-motion';
import Button from '@/components/button/Button';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { BookCarousel } from '@/components/carousel';
import SectionHeading from '@/components/common/SectionHeading';
import dummyBooks from '@/data/dummyBooks';


export default function Section2Books() {
    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto space-y-10">
                <motion.h2
                    className="text-3xl font-bold text-center text-blue-800"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                > <SectionHeading
                                    title="Buku Terbit Minggu Ini"
                                    subtitle=""
                                />
                    
                </motion.h2>

                <div className="flex flex-col-reverse md:flex-row items-center md:items-start">
                    <motion.div
                        className="w-full md:w-64 text-center md:text-left mb-8 md:mb-0 md:mt-24 md:ml-8"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="text-2xl font-bold text-blue-800 mb-4">
                            Buku-Buku Terbaru
                        </h3>
                        <Button icon={faArrowRight} variant="primary">
                            Buku lainnya
                        </Button>
                    </motion.div>

                    <BookCarousel books={dummyBooks} autoplay />
                </div>
            </div>
        </section>
    );
}
