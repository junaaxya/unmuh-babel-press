'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const containerRef = useRef(null);

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
          setShowDropdown(data.length > 0);
        }
      } catch (err) {
        console.error('Suggestion fetch error', err);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    const encoded = encodeURIComponent(trimmed);
    setShowDropdown(false);
    router.push(`/search?q=${encoded}`);
  };

  return (
    <div className="relative" ref={containerRef}>
      <form onSubmit={handleSubmit}>
        <span className="absolute translate-x-2 translate-y-1.5">
          <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: '#003185' }} />
        </span>
        <input
          type="text"
          placeholder="Cari Buku..."
          className="w-full max-w-md rounded-lg pl-8 py-2 bg-blue-200 text-black text-sm placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-800 shadow-sm transition duration-150 ease-in-out"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(suggestions.length > 0)}
        />
      </form>
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full max-w-md rounded-md bg-white shadow-lg border">
          {suggestions.map((item) => (
            <li key={item.id} className="px-3 py-2 hover:bg-gray-100">
              <Link href={`/buku/${item.id}`} onClick={() => setShowDropdown(false)}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
