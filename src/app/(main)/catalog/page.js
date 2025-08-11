'use client';

import { useState, useMemo, useEffect } from 'react';
import { BookCard } from '@/components/Book';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { getBooks, getBookCategories } from '@/app/services/api';
import Seo from '@/components/common/Seo';
import { useDebounce } from 'use-debounce';

export default function CatalogPage() {
    // State untuk data dari API dan status UI
    const [allBooks, setAllBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State untuk filter dan pencarian
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    // Mengambil semua data buku (tanpa paginasi untuk filter di client) dan kategori
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Ambil semua buku yang published dan semua kategori
                const [booksResponse, catsResponse] = await Promise.all([
                    getBooks({ status: 'published', limit: 1000 }), // Ambil semua buku
                    getBookCategories(),
                ]);
                setAllBooks(booksResponse.data || []);
                setCategories(catsResponse || []);
            } catch (err) {
                setError(err.message || 'Gagal memuat data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // Logika filter dan pengelompokan dari kode asli Anda, sekarang menggunakan data dari state
    const filteredBooks = useMemo(() => {
        const search = debouncedSearchTerm.toLowerCase();
        return allBooks.filter(
            (book) =>
                (book.title.toLowerCase().includes(search) ||
                    (book.penulis &&
                        book.penulis.toLowerCase().includes(search))) &&
                (activeCategory === 'all' || book.kategori === activeCategory)
        );
    }, [debouncedSearchTerm, activeCategory, allBooks]);

    const booksByCategory = useMemo(() => {
        const group = {};
        categories.forEach((cat) => {
            group[cat] = filteredBooks.filter((book) => book.kategori === cat);
        });
        return group;
    }, [categories, filteredBooks]);

    const resetFilters = () => {
        setSearchTerm('');
        setActiveCategory('all');
    };

    return (
        <>
            <Seo
                title="Katalog Buku"
                description="Lihat koleksi buku terbaru dari Unmuh Press."
                image="https://unmuhbabelpress.com/og-catalog.jpg"
                url="https://unmuhbabelpress.com/catalog"
            />

            <div className="bg-gray-50 min-h-screen py-12">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-gray-800 mb-3">
                            Katalog Buku
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Jelajahi koleksi lengkap publikasi UnMuh Press
                        </p>
                    </div>

                    {/* Search and Filter */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-10">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-grow relative">
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="absolute w-4 left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    fixedWidth
                                />
                                <input
                                    type="text"
                                    placeholder="Cari judul atau penulis..."
                                    className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon
                                    icon={faFilter}
                                    className="w-4 text-gray-700"
                                    fixedWidth
                                />
                                <select
                                    className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={activeCategory}
                                    onChange={(e) =>
                                        setActiveCategory(e.target.value)
                                    }
                                >
                                    <option value="all">Semua Kategori</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 text-gray-500 text-sm">
                            Menampilkan {filteredBooks.length} dari {allBooks.length} buku
                        </div>
                    </div>

                    {/* Book Display */}
                    {isLoading ? (
                        <div className="text-center py-16">
                            <FontAwesomeIcon
                                icon={faSpinner}
                                className="text-4xl text-blue-500 animate-spin"
                            />
                            <p className="mt-4 text-gray-600">Memuat buku...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-16 text-red-500">
                            <FontAwesomeIcon
                                icon={faExclamationCircle}
                                className="text-4xl mb-4"
                            />
                            <p>{error}</p>
                        </div>
                    ) : filteredBooks.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-5xl text-gray-300 mb-4">
                                📚
                            </div>
                            <h3 className="text-xl font-medium text-gray-600">
                                Tidak ada buku yang ditemukan
                            </h3>
                            <p className="text-gray-500 mt-2">
                                Coba ubah kata kunci pencarian atau filter
                                kategori
                            </p>
                            <button
                                onClick={resetFilters}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Reset Filter
                            </button>
                        </div>
                    ) : // --- MENGEMBALIKAN TAMPILAN ASLI ANDA ---
                    activeCategory === 'all' ? (
                        categories.map((category) => {
                            const booksInCategory = booksByCategory[category];
                            if (
                                !booksInCategory ||
                                booksInCategory.length === 0
                            )
                                return null;
                            return (
                                <div key={category} className="mb-12">
                                    <div className="flex items-center mb-6">
                                        <div className="w-1 h-16 bg-blue-600 mr-4"></div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            {category}
                                        </h2>
                                        <span className="ml-2 text-sm text-gray-500">
                                            ({booksInCategory.length} buku)
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {booksInCategory.map((book) => (
                                            <BookCard
                                                key={book.id}
                                                id={book.id}
                                                title={book.title}
                                                kategori={book.kategori}
                                                image={book.image}
                                                published_at={book.published_at}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBooks.map((book) => (
                                <BookCard
                                    key={book.id}
                                    id={book.id}
                                    title={book.title}
                                    kategori={book.kategori}
                                    image={book.image}
                                    published_at={book.published_at}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
