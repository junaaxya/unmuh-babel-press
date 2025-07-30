// src/components/Sections/Section4NewsEvent.js
'use client';

import { useMemo } from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import { NewsList, NewsLoading, NewsEmpty } from '@/components/News';

// 1. Import data berita dan event
import newsData from '@/data/news';
import eventData from '@/data/event';

export default function Section4NewsEvent() {
    const isLoading = false; 

    // 2. Gabungkan, urutkan, dan ambil 3 item terbaru menggunakan useMemo
    const latestItems = useMemo(() => {
        const newsWithType = newsData.map((item) => ({
            ...item,
            type: 'news', // Tambahkan tipe 'news'
        }));
        const eventsWithType = eventData.map((item) => ({
            ...item,
            type: 'event', // Tambahkan tipe 'event'
        }));

        // Gabungkan kedua data, urutkan dari yang paling baru, dan ambil 3 pertama
        return [...newsWithType, ...eventsWithType]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
    }, []);

    if (isLoading) return <NewsLoading />;
    if (!latestItems.length) return <NewsEmpty />;

    return (
        <section className="py-16 md:py-24 bg-gray-50">
            {/* 3. Pastikan ada container dan padding horizontal (px-4) untuk margin */}
            <div className="container mx-auto px-4">
                <SectionHeading
                    title="Update Berita & Event"
                    subtitle="Ikuti terus informasi dan kegiatan terbaru yang diselenggarakan oleh Unmuh Babel Press."
                />
                <div className="mt-12">
                    {/* Kirim 3 item terbaru ke NewsList */}
                    <NewsList items={latestItems} />
                </div>
            </div>
        </section>
    );
}