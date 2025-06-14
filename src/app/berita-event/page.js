// src/app/berita-event/page.js
'use client';
import { useState, useMemo } from 'react';
import NewsCard from '@/components/News/NewsCard';
import FilterTabs from '@/components/News/FilterTabs';
import SearchBar from '@/components/News/SearchBar';
import { newsData } from '@/data/news';
import { eventData } from '@/data/event';
import { faNewspaper, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function BeritaEventPage() {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Combine and sort data by date (newest first)
    const allItems = useMemo(() => {
        const newsItems = newsData.map((item) => ({ ...item, type: 'news' }));
        const eventItems = eventData.map((item) => ({
            ...item,
            type: 'events',
        }));

        return [...newsItems, ...eventItems].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );
    }, []);

    // Filter and search logic
    const filteredItems = useMemo(() => {
        let items = allItems;

        // Filter by type
        if (activeFilter !== 'all') {
            items = items.filter((item) => item.type === activeFilter);
        }

        // Search filter
        if (searchTerm) {
            items = items.filter(
                (item) =>
                    item.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.excerpt
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        return items;
    }, [allItems, activeFilter, searchTerm]);

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Berita & Event
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                            Ikuti perkembangan terbaru dan kegiatan menarik dari
                            Unmuh Babel Press
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Search Bar */}
                <SearchBar onSearch={handleSearch} />

                {/* Filter Tabs */}
                <FilterTabs
                    activeFilter={activeFilter}
                    onFilterChange={handleFilterChange}
                    newsCount={newsData.length}
                    eventCount={eventData.length}
                />

                {/* Results Info */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2 text-gray-600">
                        <FontAwesomeIcon
                            icon={
                                activeFilter === 'news'
                                    ? faNewspaper
                                    : activeFilter === 'events'
                                    ? faCalendar
                                    : faNewspaper
                            }
                            className="w-5 h-5"
                        />
                        <span className="text-sm">
                            Menampilkan {filteredItems.length} dari{' '}
                            {allItems.length}{' '}
                            {activeFilter === 'all'
                                ? 'item'
                                : activeFilter === 'news'
                                ? 'berita'
                                : 'event'}
                            {searchTerm && ` untuk "${searchTerm}"`}
                        </span>
                    </div>
                </div>

                {/* Content Grid */}
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => (
                            <NewsCard
                                key={`${item.type}-${item.id}`}
                                item={item}
                                type={item.type}
                            />
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faNewspaper}
                                className="w-12 h-12 text-gray-400"
                            />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {searchTerm
                                ? 'Tidak ada hasil ditemukan'
                                : 'Belum ada konten'}
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            {searchTerm
                                ? `Tidak dapat menemukan hasil untuk "${searchTerm}". Coba gunakan kata kunci yang berbeda.`
                                : 'Konten akan segera ditambahkan. Silakan periksa kembali nanti.'}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                Hapus Pencarian
                            </button>
                        )}
                    </div>
                )}

                {/* Load More Button (for future pagination) */}
                {filteredItems.length > 0 && (
                    <div className="text-center mt-12">
                        <button className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-all duration-200">
                            Muat Lebih Banyak
                        </button>
                    </div>
                )}
            </div>

            {/* Newsletter Section */}
            <div className="bg-blue-600 text-white py-16 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Dapatkan Update Terbaru
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Masukan email kamu untuk mendapatkan informasi terbaru
                        tentang berita dan event dari Unmuh Babel Press
                    </p>
                    <div className="max-w-md mx-auto flex flex-col md:flex-row gap-2 md:gap-2">
                        <input
                            type="email"
                            placeholder="Masukkan email Anda"
                            className="w-full px-4 py-3 rounded-lg border border-white bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <button className="w-full md:w-auto px-6 py-3 bg-blue-800 hover:bg-blue-900 rounded-lg font-medium transition-colors duration-200">
                            kirim
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
