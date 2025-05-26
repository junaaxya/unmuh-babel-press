'use client';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function SearchBar() {
    const [query, setQuery] = useState('');

    return (
        <div>
            <span
                className={`
                 absolute
                 translate-x-2
                 translate-y-1.5
                `}
            >
                <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    style={{ color: '#003185' }}
                />
            </span>

            <input
                type="text"
                placeholder="Cari Buku..."
                className="w-full max-w-md rounded-lg pl-8  py-2 bg-blue-200 text-black text-sm placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-800 shadow-sm transition duration-150 ease-in-out"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    );
}
