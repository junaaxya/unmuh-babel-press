// src/components/News/SearchFilter.js
import { useState } from 'react';
import { faSearch, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SearchFilter = ({ onSearch, onFilter, activeFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (filter) => {
    onFilter(filter);
    setIsFilterOpen(false);
  };

  const filterOptions = [
    { value: 'all', label: 'Semua' },
    { value: 'news', label: 'Berita' },
    { value: 'event', label: 'Event' },
    { value: 'upcoming', label: 'Event Mendatang' },
    { value: 'completed', label: 'Event Selesai' }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Cari berita atau event..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                onSearch('');
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors min-w-[140px] justify-center"
          >
            <FontAwesomeIcon icon={faFilter} className="h-4 w-4" />
            <span className="font-medium">Filter</span>
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="py-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                      activeFilter === option.value 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Display */}
      {activeFilter !== 'all' && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter aktif:</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {filterOptions.find(opt => opt.value === activeFilter)?.label}
          </span>
          <button
            onClick={() => handleFilterChange('all')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Hapus Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;