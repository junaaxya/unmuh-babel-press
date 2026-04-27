// src/components/admin/BookDetailModal/BookDetailModal.js
import Modal from '@/components/ui/Modal/Modal';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faUser,
  faBuilding,
  faUserEdit,
  faRuler,
  faFileText,
  faBarcode,
  faLayerGroup,
  faFileAlt,
  faCalendarAlt,
  faCheckCircle,
  faTimesCircle,
  faLink,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';

const BookDetailModal = ({ isOpen, onClose, book }) => {
  if (!book) return null;

  const defaultCover = "/cover1.jpg";
  const hasGoogleBooks = !!(book.google_books_url && book.google_books_url.trim());

  const DetailItem = ({ icon, label, value, children }) => (
    <div className="flex items-start space-x-4 py-2.5 border-b border-gray-100 last:border-b-0">
      <div className="flex-shrink-0 w-5 text-center">
        <FontAwesomeIcon icon={icon} className="h-5 w-5 text-gray-400 mt-0.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {children ? (
            <div className="text-sm text-gray-800 break-words">{children}</div>
        ) : (
            <p className="text-sm text-gray-800 break-words">{value || '-'}</p>
        )}
      </div>
    </div>
  );
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={book.title || "Detail Buku"}
      size="2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom Kiri: Cover & Status */}
        <div className="md:col-span-1 space-y-4">
          <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-md">
            <Image
              src={book.image || defaultCover}
              alt={book.title || 'Cover Buku'}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.src = defaultCover;
              }}
            />
          </div>
          <div className="text-center">
            <span className={`inline-flex items-center text-sm font-semibold px-4 py-1.5 rounded-full ${
                book.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              <FontAwesomeIcon icon={book.status === 'published' ? faCheckCircle : faTimesCircle} className="mr-2"/>
              {book.status === 'published' ? 'Diterbitkan' : 'Draf'}
            </span>
          </div>

          {/* ── Status Google Books ─────────────────────── */}
          <div className="text-center">
            {hasGoogleBooks ? (
              <a
                href={book.google_books_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
              >
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
                Tersedia di Google Books
                <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-full bg-gray-100 text-gray-500">
                <FontAwesomeIcon icon={faTimesCircle} className="w-4 h-4" />
                Belum di Google Books
              </span>
            )}
          </div>
          {/* ─────────────────────────────────────────────── */}
        </div>

        {/* Kolom Kanan: Detail Buku */}
        <div className="md:col-span-2">
            <DetailItem icon={faBarcode} label="Kode Buku" value={book.kode_buku} />
            <DetailItem icon={faBook} label="Judul Buku" value={book.title} />
            <DetailItem icon={faUser} label="Penulis" value={book.penulis} />
            <DetailItem icon={faBuilding} label="Penerbit" value={book.penerbit} />
            <DetailItem icon={faUserEdit} label="Editor" value={book.editor} />
            <DetailItem icon={faBarcode} label="ISBN" value={book.isbn} />
            <DetailItem icon={faRuler} label="Ukuran" value={book.ukuran} />
            <DetailItem icon={faFileAlt} label="Jumlah Halaman" value={book.halaman ? `${book.halaman} halaman` : '-'} />
            <DetailItem icon={faLayerGroup} label="Kategori" value={book.kategori} />
            <DetailItem icon={faCalendarAlt} label="Tanggal Terbit" value={formatDate(book.published_at)} />

            {/* ── Link Google Books ─────────────────────────── */}
            <DetailItem icon={faLink} label="Google Books">
              {hasGoogleBooks ? (
                <a
                  href={book.google_books_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline break-all"
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3 flex-shrink-0" />
                  {book.google_books_url}
                </a>
              ) : (
                <span className="text-gray-400 italic">Belum tersedia di Google Books</span>
              )}
            </DetailItem>
            {/* ─────────────────────────────────────────────── */}
        </div>
      </div>

      {/* Sinopsis */}
      {book.sinopsis && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-5 text-center">
              <FontAwesomeIcon icon={faFileText} className="h-5 w-5 text-gray-400 mt-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-gray-800 mb-2">Sinopsis</p>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {book.sinopsis}
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default BookDetailModal;