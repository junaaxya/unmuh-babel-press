// src/app/berita-event/page.js
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import NewsCard from '@/components/News/NewsCard';
import SearchFilter from '@/components/News/SearchFilter';
import { getNews } from '@/app/services/api.news';
import { getEvents } from '@/app/services/api.events';
import {
    faNewspaper,
    faCalendarCheck,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function BeritaEventPage() {
    // State untuk UI
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    // State untuk data dari API
    const [allData, setAllData] = useState([]);

    // State untuk pagination
    const [itemsPerPage] = useState(9); // Tampilkan 9 item per halaman
    const [currentPage, setCurrentPage] = useState(1);

    // Fungsi untuk mengambil semua data dari API
     // Fungsi untuk mengambil data yang HANYA sudah 'published'
    const fetchAllData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Ambil berita dan event yang statusnya 'published'
            const [newsResponse, eventsResponse] = await Promise.all([
                getNews({ limit: 100, status: 'published' }),
                // Untuk event, kita asumsikan backend mendukung filter 'publishStatus'
                // sesuai dengan skema Prisma Anda.
                getEvents({ limit: 100, publishStatus: 'published' }), 
            ]);

            const newsWithType = (newsResponse?.data?.items || []).map((item) => ({
                ...item,
                type: 'news',
            }));
            const eventsWithType = (eventsResponse?.data?.items || []).map((item) => ({
                ...item,
                type: 'event',
            }));

            const combinedData = [...newsWithType, ...eventsWithType].sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );

            setAllData(combinedData);
        } catch (error) {
            console.error('Gagal memuat data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Panggil fetchAllData sekali saat komponen dimuat
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // Gunakan useMemo untuk memfilter data secara efisien di sisi klien
    const filteredData = useMemo(() => {
        let filtered = allData;

        // Terapkan filter berdasarkan kategori
        if (activeFilter !== 'all') {
            if (activeFilter === 'news' || activeFilter === 'event') {
                filtered = filtered.filter(
                    (item) => item.type === activeFilter
                );
            } else if (activeFilter === 'upcoming') {
                filtered = filtered.filter(
                    (item) =>
                        item.type === 'event' && item.status === 'Upcoming'
                );
            } else if (activeFilter === 'completed') {
                filtered = filtered.filter(
                    (item) =>
                        item.type === 'event' && item.status === 'Completed'
                );
            }
        }

        // Terapkan filter pencarian
        if (searchTerm) {
            filtered = filtered.filter(
                (item) =>
                    item.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.excerpt
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    (item.author &&
                        item.author
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())) ||
                    (item.organizer &&
                        item.organizer
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()))
            );
        }

        return filtered;
    }, [allData, activeFilter, searchTerm]);

    // Kalkulasi untuk pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = useMemo(
        () =>
            filteredData.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
            ),
        [filteredData, currentPage, itemsPerPage]
    );

    // Reset halaman ke 1 setiap kali filter atau pencarian berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter, searchTerm]);

    // Kalkulasi statistik untuk header
    const stats = useMemo(() => {
        const newsCount = allData.filter((item) => item.type === 'news').length;
        const eventCount = allData.filter(
            (item) => item.type === 'event'
        ).length;
        const upcomingCount = allData.filter(
            (item) => item.type === 'event' && item.status === 'Upcoming'
        ).length;
        return { newsCount, eventCount, upcomingCount };
    }, [allData]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleFilter = (filter) => {
        setActiveFilter(filter);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FontAwesomeIcon
                        icon={faSpinner}
                        className="w-12 h-12 text-blue-600 animate-spin mb-4"
                    />
                    <p className="text-gray-600">Memuat berita dan event...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Berita & Event
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 mb-8">
                            Tetap update dengan berita terbaru dan acara menarik
                            dari Unmuh Babel Press
                        </p>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="flex items-center justify-center mb-4">
                                    <FontAwesomeIcon
                                        icon={faNewspaper}
                                        className="w-8 h-8 text-blue-200"
                                    />
                                </div>
                                <div className="text-3xl font-bold mb-2">
                                    {stats.newsCount}
                                </div>
                                <div className="text-blue-200">
                                    Artikel Berita
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="flex items-center justify-center mb-4">
                                    <FontAwesomeIcon
                                        icon={faCalendarCheck}
                                        className="w-8 h-8 text-purple-200"
                                    />
                                </div>
                                <div className="text-3xl font-bold mb-2">
                                    {stats.eventCount}
                                </div>
                                <div className="text-purple-200">
                                    Total Event
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="flex items-center justify-center mb-4">
                                    <FontAwesomeIcon
                                        icon={faCalendarCheck}
                                        className="w-8 h-8 text-green-200"
                                    />
                                </div>
                                <div className="text-3xl font-bold mb-2">
                                    {stats.upcomingCount}
                                </div>
                                <div className="text-green-200">
                                    Event Mendatang
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Search and Filter */}
                <SearchFilter
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                    activeFilter={activeFilter}
                />

                {/* Results Info */}
                <div className="mb-8">
                    <p className="text-gray-600">
                        Menampilkan {filteredData.length} hasil
                        {searchTerm && (
                            <span>
                                {' '}
                                untuk pencarian &quot;
                                <strong>{searchTerm}</strong>&quot;
                            </span>
                        )}
                    </p>
                </div>

                {/* Content Grid */}
                {paginatedData.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {paginatedData.map((item) => (
                                <NewsCard
                                    key={`${item.type}-${item.id}`}
                                    item={item}
                                    type={item.type}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(prev - 1, 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                >
                                    Sebelumnya
                                </button>

                                <div className="flex gap-2">
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-4 py-2 rounded-lg transition-colors ${
                                                currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(prev + 1, totalPages)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                >
                                    Selanjutnya
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faNewspaper}
                                    className="w-12 h-12 text-gray-400"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Tidak ada hasil ditemukan
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Coba ubah kata kunci pencarian atau filter yang
                                digunakan.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setActiveFilter('all');
                                }}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Reset Pencarian
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
