'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMagnifyingGlass,
    faBook,
    faNewspaper,
    faCalendar,
    faTimes,
    faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

export default function SearchBar({
    className = '',
    placeholder = 'Cari buku, berita, atau event...',
}) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (query.trim().length < 3) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        const handler = setTimeout(async () => {
            try {
                const encoded = encodeURIComponent(query.trim());
                const res = await fetch(`/api/search/suggestions?q=${encoded}`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(Array.isArray(data) ? data : []);
                    setShowDropdown(true);
                }
            } catch (err) {
                console.error('Suggestion fetch error', err);
            }
        }, 200);

        return () => clearTimeout(handler);
    }, [query]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
                setIsFocused(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        const encoded = encodeURIComponent(trimmed);
        setShowDropdown(false);
        setIsFocused(false);
        inputRef.current?.blur();
        router.push(`/search?q=${encoded}`);
    };

    const handleClear = () => {
        setQuery('');
        setSuggestions([]);
        setShowDropdown(false);
        inputRef.current?.focus();
    };

    const handleSuggestionClick = () => {
        setShowDropdown(false);
        setIsFocused(false);
    };

    const iconMap = {
        book: faBook,
        news: faNewspaper,
        event: faCalendar,
    };

    const typeColors = {
        book: 'text-blue-600 bg-blue-50',
        news: 'text-red-600 bg-red-50',
        event: 'text-green-600 bg-green-50',
    };

    const typeLabels = {
        book: 'Buku',
        news: 'Berita',
        event: 'Event',
    };

    const getHref = (item) => {
        switch (item.type) {
            case 'book':
                return `/buku/${item.id}`;
            case 'news':
                return `/berita/${item.slug}`;
            case 'event':
                return `/event/${item.slug}`;
            default:
                return '#';
        }
    };

    return (
        <div className={`relative w-full ${className}`} ref={containerRef}>
            <form onSubmit={handleSubmit} className="relative">
                {/* Search Input Container */}
                <div
                    className={`
          relative flex items-center w-full
          bg-white rounded-xl border-2 transition-all duration-300 ease-in-out
          shadow-sm hover:shadow-md
          ${
              isFocused
                  ? 'border-blue-500 shadow-lg ring-2 ring-blue-100'
                  : 'border-blue-200 hover:border-blue-300'
          }
        `}
                >
                    {/* Search Icon */}
                    <div className="absolute left-4 flex items-center pointer-events-none">
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className={`text-lg transition-colors duration-200 ${
                                isFocused ? 'text-blue-600' : 'text-gray-400'
                            }`}
                        />
                    </div>

                    {/* Input Field */}
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={placeholder}
                        className="w-full pl-12 pr-12 py-2 text-gray-800 placeholder-gray-500 bg-blue-100 rounded-2xl focus:outline-none text-base font-medium"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => {
                            setIsFocused(true);
                            if (query.trim().length >= 3) setShowDropdown(true);
                        }}
                        onBlur={() => setIsFocused(false)}
                    />

                    {/* Clear Button */}
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                        >
                            <FontAwesomeIcon
                                icon={faTimes}
                                className="text-gray-400 group-hover:text-gray-600 text-sm"
                            />
                        </button>
                    )}
                </div>

                {/* Submit Button (Mobile) */}
                <button
                    type="submit"
                    className="md:hidden mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    Cari
                </button>
            </form>

            {/* Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
                <div className="absolute z-50 mt-2 w-full">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden max-h-96 overflow-y-auto">
                        <div className="p-3 border-b border-gray-100 bg-gray-50">
                            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                Saran Pencarian
                            </p>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {suggestions.map((item, index) => (
                                <Link
                                    key={`${item.type}-${item.id ?? item.slug}-${index}`}
                                    href={getHref(item)}
                                    onClick={handleSuggestionClick}
                                    className="block p-4 hover:bg-gray-50 transition-colors duration-200 group"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Type Icon */}
                                        <div
                                            className={`
                      w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                      transition-transform duration-200 group-hover:scale-105
                      ${typeColors[item.type] || 'text-gray-600 bg-gray-50'}
                    `}
                                        >
                                            <FontAwesomeIcon
                                                icon={
                                                    iconMap[item.type] ||
                                                    faMagnifyingGlass
                                                }
                                                className="text-xs"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
                                                {item.title}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span
                                                    className={`
                          text-xs font-medium px-2 py-1 rounded-full
                          ${typeColors[item.type] || 'text-gray-600 bg-gray-100'}
                        `}
                                                >
                                                    {typeLabels[item.type] ||
                                                        'Lainnya'}
                                                </span>
                                                {(item.penulis ||
                                                    item.location) && (
                                                    <span className="text-xs text-gray-500 truncate">
                                                        {item.penulis ||
                                                            item.location}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Arrow Icon */}
                                        <FontAwesomeIcon
                                            icon={faArrowRight}
                                            className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200 text-sm"
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* View All Results */}
                        <div className="p-3 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={handleSubmit}
                                className="w-full text-left text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 py-1"
                            >
                                <FontAwesomeIcon
                                    icon={faMagnifyingGlass}
                                    className="text-xs"
                                />
                                Lihat semua hasil untuk "{query}"
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* No Suggestions Message */}
            {showDropdown &&
                query.trim().length >= 3 &&
                suggestions.length === 0 && (
                    <div className="absolute z-50 mt-2 w-full">
                        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="p-6 text-center">
                                <FontAwesomeIcon
                                    icon={faMagnifyingGlass}
                                    className="text-gray-300 text-2xl mb-3"
                                />
                                <p className="text-sm text-gray-500 mb-2">
                                    Tidak ada saran ditemukan
                                </p>
                                <button
                                    onClick={handleSubmit}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Tekan Enter untuk mencari "{query}"
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}
