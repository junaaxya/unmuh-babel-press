// src/components/admin/berita-event/SearchFilter.js
'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function SearchFilter({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  activeTab
}) {
  const newsCategories = ['Berita', 'Pengumuman', 'Artikel', 'Press Release'];
  const eventCategories = ['Event', 'Seminar', 'Workshop', 'Konferensi', 'Pelatihan'];
  const eventStatuses = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'];
  const dateOptions = [
    { value: 'all', label: 'Semua Waktu' },
    { value: 'today', label: 'Hari Ini' },
    { value: 'week', label: '7 Hari Terakhir' },
    { value: 'month', label: '30 Hari Terakhir' }
  ];

  const getStatusLabel = (status) => {
    const statusLabels = {
      'Upcoming': 'Akan Datang',
      'Ongoing': 'Berlangsung',
      'Completed': 'Selesai',
      'Cancelled': 'Dibatalkan'
    };
    return statusLabels[status] || status;
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Cari ${activeTab === 'berita' ? 'berita' : 'event'}...`}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FontAwesomeIcon 
                  icon={faTimes} 
                  className="text-gray-400 hover:text-gray-600 transition-colors" 
                />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 lg:w-auto">
          {/* Category Filter */}
          <div className="min-w-0 sm:w-40">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
            >
              <option value="all">Semua Kategori</option>
              {(activeTab === 'berita' ? newsCategories : eventCategories).map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter (Events only) */}
          {activeTab === 'event' && (
            <div className="min-w-0 sm:w-40">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              >
                <option value="all">Semua Status</option>
                {eventStatuses.map(status => (
                  <option key={status} value={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date Filter */}
          <div className="min-w-0 sm:w-40">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
            >
              {dateOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all') && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 flex items-center">
              <FontAwesomeIcon icon={faFilter} className="mr-1" />
              Filter aktif:
            </span>
            
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Pencarian: "{searchTerm}"
                <button
                  onClick={clearSearch}
                  className="ml-1 hover:text-blue-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {categoryFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {categoryFilter}
                <button
                  onClick={() => setCategoryFilter('all')}
                  className="ml-1 hover:text-green-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {activeTab === 'event' && statusFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {getStatusLabel(statusFilter)}
                <button
                  onClick={() => setStatusFilter('all')}
                  className="ml-1 hover:text-purple-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {dateFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {dateOptions.find(opt => opt.value === dateFilter)?.label}
                <button
                  onClick={() => setDateFilter('all')}
                  className="ml-1 hover:text-orange-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}