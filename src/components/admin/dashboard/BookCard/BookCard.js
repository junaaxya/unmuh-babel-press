// src/components/admin/BookCard/BookCard.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEdit,
    faTrash,
    faEye,
    faBookOpen,
    faBuilding,
    faBarcode,
    faFileLines,
    faToggleOff,
    faToggleOn,
    faExternalLinkAlt,
    faCheckCircle,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const BookCard = ({ book, onEdit, onDelete, onView, onToggleStatus, readOnly = false, showNotification }) => {
    const defaultCover = "/cover1.jpg";
    const isPublished = book.status === 'published';
    const hasGoogleBooks = !!(book.google_books_url && book.google_books_url.trim());

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
            {/* Book Cover */}
            <div className="relative h-48 w-full bg-gray-100">
                <Image
                    src={book.image || defaultCover}
                    alt={book.title || 'Cover Buku'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    onError={(e) => {
                        e.currentTarget.src = defaultCover;
                    }}
                />
                {book.kategori && (
                    <div className="absolute top-2 right-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                            {book.kategori}
                        </span>
                    </div>
                )}
            </div>

            {/* Book Info */}
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2" title={book.title}>
                    {book.title || 'Tanpa Judul'}
                </h3>

                <div className="space-y-1.5 text-sm text-gray-700 mb-4 flex-grow">
                    <p className="flex items-center" title={book.penulis}>
                        <FontAwesomeIcon icon={faBookOpen} className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium w-20">Penulis:</span>
                        <span className="ml-1 truncate">{book.penulis || '-'}</span>
                    </p>
                    <p className="flex items-center" title={book.penerbit}>
                        <FontAwesomeIcon icon={faBuilding} className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium w-20">Penerbit:</span>
                        <span className="ml-1 truncate">{book.penerbit || '-'}</span>
                    </p>
                    <p className="flex items-center" title={book.isbn}>
                        <FontAwesomeIcon icon={faBarcode} className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium w-20">ISBN:</span>
                        <span className="ml-1 truncate">{book.isbn || '-'}</span>
                    </p>
                    <p className="flex items-center">
                        <FontAwesomeIcon icon={faFileLines} className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium w-20">Halaman:</span>
                        <span className="ml-1">{book.halaman || '-'}</span>
                    </p>
                </div>

                {/* ── Status Google Books ───────────────────────────────── */}
                {hasGoogleBooks ? (
                    // Sudah ada link → tampilkan tombol buka
                    <a
                        href={book.google_books_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full mb-3 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3" />
                        Tersedia di Google Books ✅
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3 ml-1" />
                    </a>
                ) : (
                    // Belum ada link → badge info saja
                    <div className="w-full mb-3 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-500 text-xs font-medium rounded-lg">
                        <FontAwesomeIcon icon={faTimesCircle} className="w-3 h-3" />
                        Belum tersedia di Google Books
                    </div>
                )}
                {/* ─────────────────────────────────────────────────────── */}

                {/* Action Buttons */}
                <div className="flex justify-between items-center border-t pt-3 mt-auto">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onView(book)}
                            title="Lihat Detail"
                            className="flex items-center justify-center w-9 h-9 text-sm bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                        >
                            <FontAwesomeIcon icon={faEye} />
                        </button>
                        {!readOnly && (
                            <>
                                <button
                                    onClick={() => onEdit(book)}
                                    title="Edit Buku"
                                    className="flex items-center justify-center w-9 h-9 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                    onClick={() => onDelete(book)}
                                    title="Hapus Buku"
                                    className="flex items-center justify-center w-9 h-9 text-sm bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </>
                        )}
                    </div>
                    {!readOnly && (
                        <div>
                            <button
                                onClick={() => onToggleStatus(book)}
                                title={isPublished ? 'Ubah ke Draf' : 'Publikasikan'}
                                className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                                    isPublished
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                }`}
                            >
                                <FontAwesomeIcon icon={isPublished ? faToggleOn : faToggleOff} className="mr-2 h-4 w-4" />
                                {isPublished ? 'Published' : 'Draft'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookCard;