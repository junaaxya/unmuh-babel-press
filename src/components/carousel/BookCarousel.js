'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard from '../Book/BookCard';
import LazyItem from './LazyItem';

export default function BookCarousel({ books, autoplay = true }) {
    const scrollRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Auto-scroll every 3s
    useEffect(() => {
        if (!autoplay) return;
        const interval = setInterval(() => {
            if (scrollRef.current && !dragging) {
                scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [autoplay, dragging]);

    // Keyboard navigation ← →
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') scroll('right');
            if (e.key === 'ArrowLeft') scroll('left');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const scroll = (direction) => {
        const offset = direction === 'left' ? -300 : 300;
        scrollRef.current?.scrollBy({ left: offset, behavior: 'smooth' });
    };

    // Touch event handlers for mobile
    const handleTouchStart = (e) => {
        setDragging(true);
        setStartX(e.touches[0].pageX);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!dragging) return;
        e.preventDefault();
        const x = e.touches[0].pageX;
        const walk = (x - startX) * 2; // Multiply for faster scroll
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setDragging(false);
    };

    return (
        <div className="relative w-full group overflow-x-hidden">
            {/* LEFT ARROW */}
            <button
                onClick={() => scroll('left')}
                aria-label="Scroll left"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronLeft size={24} />
            </button>

            {/* SCROLL CONTAINER */}
            <motion.div
                ref={scrollRef}
                className="flex space-x-4 px-6 scrollbar-hide snap-x snap-mandatory overflow-x-auto touch-pan-x"
                onMouseDown={() => setDragging(true)}
                onMouseUp={() => setDragging(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                tabIndex={0}
            >
                {(books ?? []).map((book) => (
                    <LazyItem key={book.id}>
                        <BookCard {...book} />
                    </LazyItem>
                ))}
            </motion.div>

            {/* RIGHT ARROW */}
            <button
                onClick={() => scroll('right')}
                aria-label="Scroll right"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
}