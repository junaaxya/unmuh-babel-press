'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [newsResults, setNewsResults] = useState([]);
  const [eventResults, setEventResults] = useState([]);
  const [bookResults, setBookResults] = useState([]);
  const [loading, setLoading] = useState(true);

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
    async function fetchResults() {
      const trimmed = query.trim();
      if (!trimmed) {
        setNewsResults([]);
        setEventResults([]);
        setBookResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const encoded = encodeURIComponent(trimmed);
        const [newsRes, eventsRes, booksRes] = await Promise.all([
          fetch(`/api/berita/search?q=${encoded}`),
          fetch(`/api/events/search?q=${encoded}`),
          fetch(`/api/books/search?q=${encoded}`),
        ]);
        const news = newsRes.ok ? await newsRes.json() : [];
        const events = eventsRes.ok ? await eventsRes.json() : [];
        const books = booksRes.ok ? await booksRes.json() : [];
        setNewsResults(Array.isArray(news) ? news : []);
        setEventResults(Array.isArray(events) ? events : []);
        setBookResults(Array.isArray(books) ? books : []);
      } catch (err) {
        console.error('Error during search', err);
        setNewsResults([]);
        setEventResults([]);
        setBookResults([]);
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
    !newsResults.length && !eventResults.length && !bookResults.length;

  if (noResults) {
    return (
      <div className="p-4 text-center text-gray-500">
        {`No results found for "${query}".`}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      {newsResults.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2">News Search Results</h2>
          <ul className="space-y-1">
            {newsResults.map((item) => (
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

      {eventResults.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Event Search Results</h2>
          <ul className="space-y-1">
            {eventResults.map((item) => (
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

      {bookResults.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Book Search Results</h2>
          <ul className="space-y-1">
            {bookResults.map((item) => (
              <li key={item.id} className="border-b pb-1">
                <span className="text-blue-700">
                  {highlight(item.title)}
                </span>
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


