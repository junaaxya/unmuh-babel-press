'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard from '../books/BookCard';
import LazyItem from './LazyItem';

export default function BookCarousel({ books, autoplay = true }) {
    const scrollRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        if (!autoplay) return;
        const interval = setInterval(() => {
            if (scrollRef.current && !dragging) {
                scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [autoplay, dragging]);

    const scroll = (direction) => {
        const offset = direction === 'left' ? -300 : 300;
        scrollRef.current?.scrollBy({ left: offset, behavior: 'smooth' });
    };

    return (
        <div className="relative w-full group">
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow rounded-full opacity-0 group-hover:opacity-100"
            >
                <ChevronLeft size={24} />
            </button>

            <motion.div
                ref={scrollRef}
                className="flex overflow-x-auto space-x-4 px-6 scrollbar-hide"
                onMouseDown={() => setDragging(true)}
                onMouseUp={() => setDragging(false)}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                {books.map((book) => (
                    <LazyItem key={book.id}>
                        {' '}
                        <BookCard key={book.id} {...book} />
                    </LazyItem>
                ))}
            </motion.div>

            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow rounded-full opacity-0 group-hover:opacity-100"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
}
