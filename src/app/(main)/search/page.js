'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

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
        <mark key={index}>{text.slice(index, index + query.length)}</mark>
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
      <div className="flex justify-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  const noResults =
    !results.news.length && !results.events.length && !results.books.length;

  if (noResults) {
    return (
      <div className="p-4 text-center text-gray-500">
        {`No results found for "${query}".`}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      {results.news.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2">News Search Results</h2>
          <ul className="space-y-1">
            {results.news.map((item) => (
              <li key={item.id} className="border-b pb-1">
                {item.slug ? (
                  <Link
                    href={`/berita/${item.slug}`}
                    className="text-blue-700 hover:underline"
                  >
                    {highlight(item.title || item.judul)}
                  </Link>
                ) : (
                  <span>{highlight(item.title || item.judul)}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {results.events.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Event Search Results</h2>
          <ul className="space-y-1">
            {results.events.map((item) => (
              <li key={item.id} className="border-b pb-1">
                {item.slug ? (
                  <Link
                    href={`/event/${item.slug}`}
                    className="text-blue-700 hover:underline"
                  >
                    {highlight(item.title)}
                  </Link>
                ) : (
                  <span>{highlight(item.title)}</span>
                )}
                {item.location && (
                  <span className="block text-xs text-gray-500">
                    {highlight(item.location)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {results.books.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Book Search Results</h2>
          <ul className="space-y-1">
            {results.books.map((item) => (
              <li key={item.id} className="border-b pb-1">
                <Link
                  href={`/buku/${item.id}`}
                  className="text-blue-700 hover:underline"
                >
                  {highlight(item.title)}
                </Link>
                {item.penulis && (
                  <span className="block text-xs text-gray-500">
                    {highlight(item.penulis)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
