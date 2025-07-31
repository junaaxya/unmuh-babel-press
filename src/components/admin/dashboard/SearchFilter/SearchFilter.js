// src/components/admin/SearchFilter/SearchFilter.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

const SearchFilter = ({ 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange,
  onClearFilters,
  totalBooks,
  filteredBooks 
}) => {
  const categories = [
    { value: '', label: 'Semua Kategori' },
    { value: 'Pendidikan', label: 'Pendidikan' },
    { value: 'Agama', label: 'Agama' },
    { value: 'Teknologi', label: 'Teknologi' },
    { value: 'Sejarah', label: 'Sejarah' },
    { value: 'Sastra', label: 'Sastra' },
    { value: 'Sains', label: 'Sains' },
    { value: 'Ekonomi', label: 'Ekonomi' },
    { value: 'Politik', label: 'Politik' },
    { value: 'Budaya', label: 'Budaya' },
    { value: 'Lainnya', label: 'Lainnya' }
  ];

  const hasActiveFilters = searchTerm || selectedCategory;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari berdasarkan judul, penulis, atau ISBN..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="md:w-64">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faFilter} className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
          >
            <FontAwesomeIcon icon={faTimes} className="h-4 w-4 mr-2" />
            Bersihkan Filter
          </button>
        )}
      </div>

      {/* Results Summary */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>
          Menampilkan {filteredBooks} dari {totalBooks} buku
          {hasActiveFilters && (
            <span className="ml-2 text-blue-600">
              (dengan filter aktif)
            </span>
          )}
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center space-x-2">
            <span>Filter aktif:</span>
            {searchTerm && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                &quot;{searchTerm}&quot;
              </span>
            )}
            {selectedCategory && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {selectedCategory}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;