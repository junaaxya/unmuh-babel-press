// src/components/admin/BookCard/BookCard.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const BookCard = ({ book, onEdit, onDelete, onView }) => {
  const defaultCover = "/cover1.jpg";

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Book Cover */}
      <div className="relative h-48 bg-gray-100">
        <Image
          src={book.image || defaultCover}
          alt={book.title}
          width={200} height={300}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = defaultCover;
          }}
        />
        <div className="absolute top-2 right-2">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {book.kategori}
          </span>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {book.title}
        </h3>
        
        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <p className="flex items-center">
            <FontAwesomeIcon icon={faBookOpen} className="w-4 h-4 mr-2" />
            <span className="font-medium">Penulis:</span>
            <span className="ml-1 truncate">{book.Penulis}</span>
          </p>
          <p><span className="font-medium">Penerbit:</span> {book.Penerbit}</p>
          <p><span className="font-medium">ISBN:</span> {book.ISBN}</p>
          <p><span className="font-medium">Halaman:</span> {book.Halaman}</p>
        </div>

        {/* Synopsis Preview */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {book.sinopsis}
        </p>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => onView(book)}
              className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
            >
              <FontAwesomeIcon icon={faEye} className="w-4 h-4 mr-1" />
              Lihat
            </button>
            <button
              onClick={() => onEdit(book)}
              className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              <FontAwesomeIcon icon={faEdit} className="w-4 h-4 mr-1" />
              Edit
            </button>
            <button
              onClick={() => onDelete(book)}
              className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              <FontAwesomeIcon icon={faTrash} className="w-4 h-4 mr-1" />
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;