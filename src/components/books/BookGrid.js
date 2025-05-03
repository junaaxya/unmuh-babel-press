'use client';

import BookCard from './BookCard';

export default function BookGrid({ books = [] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {books.map((book) => (
                <BookCard key={book.id} {...book} />
            ))}
        </div>
    );
}
