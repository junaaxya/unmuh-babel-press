// src/components/admin/berita-event/NewsEventTable.js
'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { 
  faEdit, 
  faTrash, 
  faEye, 
  faImage,
  faCalendarAlt,
  faUser,
  faMapMarkerAlt,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

export default function NewsEventTable({ 
  items, 
  activeTab, 
  onEdit, 
  onDelete, 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems,
  itemsPerPage 
}) {
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Upcoming': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Akan Datang' },
      'Ongoing': { bg: 'bg-green-100', text: 'text-green-800', label: 'Berlangsung' },
      'Completed': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Selesai' },
      'Cancelled': { bg: 'bg-red-100', text: 'text-red-800', label: 'Dibatalkan' }
    };

    const config = statusConfig[status] || statusConfig['Completed'];
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Menampilkan <span className="font-medium">{startItem}</span> sampai{' '}
              <span className="font-medium">{endItem}</span> dari{' '}
              <span className="font-medium">{totalItems}</span> hasil
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="text-center py-12">
          <FontAwesomeIcon 
            icon={activeTab === 'berita' ? faImage : faCalendarAlt} 
            className="text-gray-400 text-4xl mb-4" 
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Belum Ada {activeTab === 'berita' ? 'Berita' : 'Event'}
          </h3>
          <p className="text-gray-500">
            Mulai dengan menambahkan {activeTab === 'berita' ? 'berita' : 'event'} pertama Anda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {activeTab === 'berita' ? 'Berita' : 'Event'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              {activeTab === 'event' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {activeTab === 'berita' ? 'Penulis' : 'Penyelenggara'}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-16 w-16">
                      <Image
                        className="h-16 w-16 rounded-lg object-cover"
                        src={item.image}
                        alt={item.title}
                        width={200} height={300}
                        onError={(e) => {
                          e.target.src = '/placeholder.jpg';
                        }}
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {truncateText(item.title, 60)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {truncateText(item.excerpt, 80)}
                      </div>
                      {activeTab === 'event' && item.location && (
                        <div className="text-xs text-gray-400 mt-1 flex items-center">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                          {item.location}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(item.date)}
                  </div>
                  {activeTab === 'event' && item.time && (
                    <div className="text-xs text-gray-500">
                      {item.time}
                    </div>
                  )}
                </td>
                {activeTab === 'event' && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-400" />
                    {activeTab === 'berita' ? item.author : item.organizer}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => window.open(`/${activeTab}/${item.slug}`, '_blank')}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Lihat"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Hapus"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.id} className="p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Image
                    className="h-16 w-16 rounded-lg object-cover"
                    src={item.image}
                    alt={item.title}
                    width={200} height={300}
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {truncateText(item.title, 50)}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {truncateText(item.excerpt, 60)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                        {formatDate(item.date)}
                      </div>
                      {activeTab === 'event' && item.time && (
                        <div className="text-xs text-gray-500 mt-1">
                          {item.time}
                        </div>
                      )}
                      {activeTab === 'event' && item.status && (
                        <div className="mt-2">
                          {getStatusBadge(item.status)}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(`/${activeTab}/${item.slug}`, '_blank')}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                        title="Lihat"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        onClick={() => onEdit(item)}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Hapus"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}