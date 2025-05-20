'use client';

import { useState, useMemo } from 'react';
import Head from 'next/head';
import { BookCard } from '@/components/Book';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import dummyBooks from '@/data/dummyBooks';

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Validasi dan normalisasi data dummyBooks
  const normalizedBooks = dummyBooks.map(book => ({
    id: book.id || Math.random().toString(36).substring(2, 9),
    title: book.title || 'Judul Tidak Tersedia',
    Penulis: book.Penulis || 'Penulis Tidak Diketahui',
    kategori: book.kategori || 'Umum',
    image: book.image || '/default-book-cover.jpg', // Pastikan ada gambar default
    tahun_terbit: book.tahun_terbit || '-',
  }));
  
  // Extract unique categories
  const categories = [...new Set(normalizedBooks.map(book => book.kategori))];
  
  // Filter books
 const filteredBooks = useMemo(() => {
  const searchLower = searchTerm.toLowerCase();
  
  return normalizedBooks.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchLower) ||
      book.Penulis.toLowerCase().includes(searchLower);
      
    const matchesCategory =
      activeCategory === 'all' || book.kategori === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
}, [searchTerm, activeCategory, normalizedBooks]);
  
  // Group books by category
const booksByCategory = useMemo(() => {
  const group = {};
  categories.forEach(category => {
    group[category] = filteredBooks.filter(book => book.kategori === category);
  });
  return group;
}, [categories, filteredBooks]);
  return (
    <>
      <Head>
        <title>Katalog Buku | UnMuh Press</title>
        <meta name="description" content="Katalog lengkap buku terbitan UnMuh Press" />
      </Head>

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Katalog Buku</h1>
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
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="text"
                  placeholder="Cari judul atau penulis..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} className="text-gray-700" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                >
                  <option value="all">Semua Kategori</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4 text-gray-500 text-sm">
              Menampilkan {filteredBooks.length} dari {normalizedBooks.length} buku
            </div>
          </div>

          {/* Books Display */}
          {filteredBooks.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl text-gray-300 mb-4">📚</div>
              <h3 className="text-xl font-medium text-gray-600">
                Tidak ada buku yang ditemukan
              </h3>
              <p className="text-gray-500 mt-2">
                Coba ubah kata kunci pencarian atau filter kategori
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Reset Filter
              </button>
            </div>
          ) : activeCategory === 'all' ? (
            // Tampilkan berdasarkan kategori
            categories.map(category => {
              const booksInCategory = booksByCategory[category] || [];
              if (booksInCategory.length === 0) return null;
              
              return (
                <div key={category} className="mb-12">
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-16 bg-blue-600 mr-4"></div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {category}
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          ({booksInCategory.length} buku)
                        </span>
                      </h2>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {booksInCategory.map(book => (
                      <BookCard 
                        key={book.id}
                        id={book.id}
                        title={book.title}
                        kategori={book.kategori}
                        image={book.image}
                        tahun_terbit={book.tahun_terbit}
                        harga={book.harga}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // Tampilkan buku dalam kategori tertentu
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map(book => (
                <BookCard 
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  kategori={book.kategori}
                  image={book.image}
                  tahun_terbit={book.tahun_terbit}
                  harga={book.harga}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}