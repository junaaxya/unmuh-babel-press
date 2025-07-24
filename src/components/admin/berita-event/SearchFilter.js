import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function SearchFilter({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  activeTab
}) {
  const categoryOptions = activeTab === 'berita' 
    ? ['Berita', 'Pengumuman', 'Artikel', 'Press Release']
    : ['Event', 'Workshop', 'Seminar', 'Konferensi', 'Pelatihan'];

  const statusOptions = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

  const handleClearFilters = () => {
    onSearchChange('');
    onCategoryChange('');
    onStatusChange('');
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedStatus;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={`Cari ${activeTab === 'berita' ? 'berita' : 'event'}...`}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Category Filter */}
        <div className="flex-1">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Semua Kategori</option>
            {categoryOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Status Filter (only for events) */}
        {activeTab === 'event' && (
          <div className="flex-1">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Semua Status</option>
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4 mr-2" />
            Hapus Filter
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Filter aktif:</span>
          
          {searchTerm && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              <FontAwesomeIcon icon={faSearch} className="w-3 h-3 mr-1" />
              "{searchTerm}"
              <button
                onClick={() => onSearchChange('')}
                className="ml-2 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCategory && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              <FontAwesomeIcon icon={faFilter} className="w-3 h-3 mr-1" />
              {selectedCategory}
              <button
                onClick={() => onCategoryChange('')}
                className="ml-2 hover:text-green-600 dark:hover:text-green-400"
              >
                <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedStatus && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
              <FontAwesomeIcon icon={faFilter} className="w-3 h-3 mr-1" />
              {selectedStatus}
              <button
                onClick={() => onStatusChange('')}
                className="ml-2 hover:text-purple-600 dark:hover:text-purple-400"
              >
                <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}