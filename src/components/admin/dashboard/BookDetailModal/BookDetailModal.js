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
} from '@fortawesome/free-solid-svg-icons';

const BookDetailModal = ({ isOpen, onClose, book }) => {
  if (!book) return null;

  const defaultCover = "/cover2.jpg";

  const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3 py-2">
      <div className="flex-shrink-0">
        <FontAwesomeIcon icon={icon} className="h-5 w-5 text-gray-500 mt-0.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600 break-words">{value || '-'}</p>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Buku"
      size="lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Book Cover */}
        <div className="md:col-span-1">
          <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={book.image || defaultCover}
              alt={book.title}
              width={200} height={300}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = defaultCover;
              }}
            />
          </div>
          <div className="mt-3 text-center">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {book.kategori}
            </span>
          </div>
        </div>

        {/* Book Details */}
        <div className="md:col-span-2 space-y-1">
          <DetailItem 
            icon={faBarcode} 
            label="Kode Buku" 
            value={book.Kode_Buku} 
          />

          <DetailItem 
            icon={faBook} 
            label="Judul Buku" 
            value={book.title} 
          />
          
          <DetailItem 
            icon={faUser} 
            label="Penulis" 
            value={book.Penulis} 
          />
          
          <DetailItem 
            icon={faBuilding} 
            label="Penerbit" 
            value={book.Penerbit} 
          />
          
          <DetailItem 
            icon={faUserEdit} 
            label="Editor" 
            value={book.Editor} 
          />
          
          <DetailItem 
            icon={faBarcode} 
            label="ISBN" 
            value={book.ISBN} 
          />
          
          <DetailItem 
            icon={faRuler} 
            label="Ukuran" 
            value={book.Ukuran} 
          />
          
          <DetailItem 
            icon={faFileAlt} 
            label="Jumlah Halaman" 
            value={book.Halaman ? `${book.pages} halaman` : '-'} 
          />
          
          <DetailItem 
            icon={faLayerGroup} 
            label="Kategori" 
            value={book.Kategori} 
          />
        </div>
      </div>

      {/* Synopsis */}
      {book.synopsis && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faFileText} className="h-5 w-5 text-gray-500 mt-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 mb-2">Sinopsis</p>
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