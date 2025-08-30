'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faNewspaper,
  faCalendar,
  faSearch,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ books: [], news: [], events: [] });
  const [loading, setLoading] = useState(false);

  // Highlight matched keywords within a text
  const highlight = (text) => {
    if (!query) return text;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const parts = [];
    let start = 0;
    let index = lowerText.indexOf(lowerQuery);
    while (index !== -1) {
      parts.push(text.slice(start, index));
      parts.push(
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {text.slice(index, index + query.length)}
        </mark>
      );
      start = index + query.length;
      index = lowerText.indexOf(lowerQuery, start);
    }
    parts.push(text.slice(start));
    return parts;
  };

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults({ books: [], news: [], events: [] });
      return;
    }
    setLoading(true);
    async function fetchResults() {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          setResults({
            books: Array.isArray(data.books) ? data.books : [],
            news: Array.isArray(data.news) ? data.news : [],
            events: Array.isArray(data.events) ? data.events : [],
          });
        } else {
          setResults({ books: [], news: [], events: [] });
        }
      } catch (err) {
        console.error('Error during search', err);
        setResults({ books: [], news: [], events: [] });
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
          <FontAwesomeIcon 
            icon={faSpinner} 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 animate-spin text-lg"
          />
        </div>
        <p className="mt-4 text-gray-600 font-medium">Mencari hasil...</p>
      </div>
    );
  }

  const noResults =
    !results.news.length && !results.events.length && !results.books.length;

  if (noResults) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Tidak ada hasil ditemukan
          </h3>
          <p className="text-gray-500 mb-4">
            Tidak ada hasil untuk pencarian <span className="font-medium">"{query}"</span>
          </p>
          <div className="text-sm text-gray-400">
            <p>Coba gunakan kata kunci yang berbeda</p>
            <p>atau periksa ejaan pencarian Anda</p>
          </div>
        </div>
      </div>
    );
  }

  const getSectionIcon = (type) => {
    switch (type) {
      case 'news': return faNewspaper;
      case 'events': return faCalendar;
      case 'books': return faBook;
      default: return faSearch;
    }
  };

  const getSectionTitle = (type) => {
    switch (type) {
      case 'news': return 'Berita';
      case 'events': return 'Event';
      case 'books': return 'Buku';
      default: return 'Hasil';
    }
  };

  const getSectionColor = (type) => {
    switch (type) {
      case 'news': return 'text-red-600 bg-red-50';
      case 'events': return 'text-green-600 bg-green-50';
      case 'books': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const renderSection = (items, type, linkBase) => {
    if (items.length === 0) return null;

    return (
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className={`px-6 py-4 border-b border-gray-100 ${getSectionColor(type)}`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${getSectionColor(type)} flex items-center justify-center`}>
              <FontAwesomeIcon 
                icon={getSectionIcon(type)} 
                className="text-sm"
              />
            </div>
            <h2 className="text-lg font-semibold">
              {getSectionTitle(type)}
            </h2>
            <span className="ml-auto text-sm font-medium bg-white/80 px-2 py-1 rounded-full">
              {items.length} hasil
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {items.map((item, index) => (
            <div 
              key={item.id || index} 
              className="p-6 hover:bg-gray-50 transition-colors duration-200 group"
            >
              {item.slug || (type === 'books') ? (
                <Link
                  href={type === 'books' ? `/buku/${item.id}` : `/${linkBase}/${item.slug}`}
                  className="block"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg ${getSectionColor(type)} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                      <FontAwesomeIcon 
                        icon={getSectionIcon(type)} 
                        className="text-sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                        {highlight(item.title || item.judul)}
                      </h3>
                      {(item.penulis || item.location) && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                          {highlight(item.penulis || item.location)}
                        </p>
                      )}
                      {item.excerpt && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                          {highlight(item.excerpt)}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg ${getSectionColor(type)} flex items-center justify-center flex-shrink-0`}>
                    <FontAwesomeIcon 
                      icon={getSectionIcon(type)} 
                      className="text-sm"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 line-clamp-2">
                      {highlight(item.title || item.judul)}
                    </h3>
                    {(item.penulis || item.location) && (
                      <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                        {highlight(item.penulis || item.location)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-4xl">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-800">
              Hasil Pencarian
            </h1>
          </div>
          <p className="text-gray-600">
            Menampilkan hasil untuk <span className="font-semibold text-gray-800">&quot;{query}&quot;</span>
          </p>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {renderSection(results.news, 'news', 'berita')}
          {renderSection(results.events, 'events', 'event')}
          {renderSection(results.books, 'books', 'buku')}
        </div>

        {/* Results Summary */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-100">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faNewspaper} className="text-red-500" />
              {results.news.length} Berita
            </span>
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendar} className="text-green-500" />
              {results.events.length} Event
            </span>
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBook} className="text-blue-500" />
              {results.books.length} Buku
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}