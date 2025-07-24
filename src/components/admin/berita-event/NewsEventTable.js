import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye, faCalendar, faMapMarkerAlt, faUser, faClock } from '@fortawesome/free-solid-svg-icons';

export default function NewsEventTable({ data, type, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Ongoing': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Upcoming': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'}`}>
        {status}
      </span>
    );
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
          <FontAwesomeIcon icon={type === 'berita' ? faEdit : faCalendar} />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Tidak ada {type === 'berita' ? 'berita' : 'event'}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Mulai dengan menambahkan {type === 'berita' ? 'berita' : 'event'} pertama Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {type === 'berita' ? 'Berita' : 'Event'}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Tanggal
            </th>
            {type === 'event' && (
              <>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Waktu & Lokasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </>
            )}
            {type === 'berita' && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Penulis
              </th>
            )}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <td className="px-6 py-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-16 w-16 rounded-lg object-cover"
                      src={item.image}
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900 dark:text-white">
                  <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 mr-2 text-gray-400" />
                  {formatDate(item.date)}
                </div>
              </td>

              {type === 'event' && (
                <>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-2 text-gray-400" />
                        {item.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate max-w-32">{item.location}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                </>
              )}

              {type === 'berita' && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900 dark:text-white">
                    <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate max-w-32">{item.author}</span>
                  </div>
                </td>
              )}

              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    title="Edit"
                  >
                    <FontAwesomeIcon icon={faEdit} className="w-3 h-3 mr-1" />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => onDelete(item)}
                    className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 dark:bg-red-900 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-800 transition-colors duration-200"
                    title="Hapus"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-3 h-3 mr-1" />
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}