// src/components/Sections/Section4NewsEvent.js
'use client';

import { useState, useEffect } from 'react'; // Ganti useMemo dengan useState dan useEffect
import SectionHeading from '@/components/common/SectionHeading';
import { NewsList, NewsLoading, NewsEmpty } from '@/components/News';

// 1. Import fungsi API, bukan data statis
import { getNews, getEvents } from '@/app/services/api';

export default function Section4NewsEvent() {
    // 2. Gunakan useState untuk mengelola data dan loading state
    const [latestItems, setLatestItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        // 3. Buat fungsi async untuk mengambil data dari API
        const fetchLatestItems = async () => {
            try {
                // Ambil 3 berita terbaru dan 3 event terbaru secara paralel
                const [newsResponse, eventsResponse] = await Promise.all([
                    getNews({ limit: 3, status: 'published' }), // Hanya ambil berita yang sudah publish
                    getEvents({ limit: 3, status: 'Upcoming' }) // Hanya ambil event yang akan datang
                ]);

                // Tambahkan properti 'type' ke setiap item
                const newsWithType = newsResponse.data.items.map((item) => ({
                    ...item,
                    type: 'news',
                }));
                const eventsWithType = eventsResponse.data.items.map((item) => ({
                    ...item,
                    type: 'event',
                }));

                // Gabungkan, urutkan berdasarkan tanggal terbaru, dan ambil 3 teratas
                const combinedItems = [...newsWithType, ...eventsWithType]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 3);

                setLatestItems(combinedItems);
            } catch (error) {
                console.error("Gagal memuat berita & event terbaru:", error);
                // Jika gagal, tampilkan state kosong
                setLatestItems([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestItems();
    }, []); // Array dependensi kosong agar hanya berjalan sekali saat komponen dimuat

    // Tampilan Loading dan Kosong sudah siap digunakan
    if (isLoading) return <NewsLoading />;
    if (!latestItems.length) return <NewsEmpty />;

    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title="Update Berita & Event"
                    subtitle="Ikuti terus informasi dan kegiatan terbaru yang diselenggarakan oleh Unmuh Babel Press."
                />
                <div className="mt-12">
                    {/* Kirim 3 item terbaru dari state ke NewsList */}
                    <NewsList items={latestItems} />
                </div>
            </div>
        </section>
    );
}
