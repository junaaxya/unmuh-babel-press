'use client';
import { useState } from 'react';

export default function SearchBar() {
    const [query, setQuery] = useState('');

    return (
        <input
            type="text"
            placeholder="Cari Buku..."
            className="rounded px-2 py-1 text-black text-sm bg-amber-50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    );
}
