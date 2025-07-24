// src/app/admin/dashboard/berita-event/page.js
'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layouts/AdminLayout';
import NewsEventTable from '@/components/admin/berita-event/NewsEventTable';
import NewsEventForm from '@/components/admin/berita-event/NewsEventForm';
import SearchFilter from '@/components/admin/berita-event/SearchFilter';
import Modal from '@/components/ui/Modal/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal/ConfirmationModal';
import Notification from '@/components/ui/Notification/Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faNewspaper, faCalendarDays } from '@fortawesome/free-solid-svg-icons';

// Import dummy data
import newsData from '@/data/news';
import eventData from '@/data/event';

export default function BeritaEventPage() {
  // State management
  const [activeTab, setActiveTab] = useState('berita');
  const [newsItems, setNewsItems] = useState([]);
  const [eventItems, setEventItems] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Initialize data
  useEffect(() => {
    setNewsItems(newsData);
    setEventItems(eventData);
  }, []);

  // Get current items based on active tab
  const getCurrentItems = () => {
    return activeTab === 'berita' ? newsItems : eventItems;
  };

  // Filter items based on search and filters
  const getFilteredItems = () => {
    let items = getCurrentItems();

    // Search filter
    if (searchTerm) {
      items = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.organizer && item.organizer.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      items = items.filter(item => item.category === categoryFilter);
    }

    // Status filter (for events)
    if (activeTab === 'event' && statusFilter !== 'all') {
      items = items.filter(item => item.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          items = items.filter(item => new Date(item.date) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          items = items.filter(item => new Date(item.date) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          items = items.filter(item => new Date(item.date) >= filterDate);
          break;
      }
    }

    return items;
  };

  // Pagination
  const getPaginatedItems = () => {
    const filteredItems = getFilteredItems();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(getFilteredItems().length / itemsPerPage);
  };

  // CRUD operations
  const handleCreate = (newItem) => {
    const id = Date.now(); // Simple ID generation
    const itemWithId = { ...newItem, id };
    
    if (activeTab === 'berita') {
      setNewsItems(prev => [...prev, itemWithId]);
    } else {
      setEventItems(prev => [...prev, itemWithId]);
    }
    
    setIsFormModalOpen(false);
    showNotification(`${activeTab === 'berita' ? 'Berita' : 'Event'} berhasil ditambahkan!`, 'success');
  };

  const handleUpdate = (updatedItem) => {
    if (activeTab === 'berita') {
      setNewsItems(prev => prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ));
    } else {
      setEventItems(prev => prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ));
    }
    
    setIsFormModalOpen(false);
    setEditingItem(null);
    showNotification(`${activeTab === 'berita' ? 'Berita' : 'Event'} berhasil diperbarui!`, 'success');
  };

  const handleDelete = () => {
    if (activeTab === 'berita') {
      setNewsItems(prev => prev.filter(item => item.id !== deletingItem.id));
    } else {
      setEventItems(prev => prev.filter(item => item.id !== deletingItem.id));
    }
    
    setIsDeleteModalOpen(false);
    setDeletingItem(null);
    showNotification(`${activeTab === 'berita' ? 'Berita' : 'Event'} berhasil dihapus!`, 'success');
  };

  // Event handlers
  const handleEdit = (item) => {
    setEditingItem(item);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setDateFilter('all');
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setDateFilter('all');
    setCurrentPage(1);
  };

  return (
    
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kelola Berita & Event
          </h1>
          <p className="text-gray-600">
            Tambah, edit, dan kelola konten berita serta event UnmuhBabelPress
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange('berita')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'berita'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FontAwesomeIcon icon={faNewspaper} className="mr-2" />
                Berita ({newsItems.length})
              </button>
              <button
                onClick={() => handleTabChange('event')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'event'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FontAwesomeIcon icon={faCalendarDays} className="mr-2" />
                Event ({eventItems.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button
            onClick={() => {
              setEditingItem(null);
              setIsFormModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            Tambah {activeTab === 'berita' ? 'Berita' : 'Event'}
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Total: {getFilteredItems().length} item</span>
            {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all') && (
              <button
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          activeTab={activeTab}
        />

        {/* Table */}
        <NewsEventTable
          items={getPaginatedItems()}
          activeTab={activeTab}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          currentPage={currentPage}
          totalPages={getTotalPages()}
          onPageChange={setCurrentPage}
          totalItems={getFilteredItems().length}
          itemsPerPage={itemsPerPage}
        />

        {/* Modals */}
        <Modal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingItem(null);
          }}
          title={`${editingItem ? 'Edit' : 'Tambah'} ${activeTab === 'berita' ? 'Berita' : 'Event'}`}
          size="xl"
        >
          <NewsEventForm
            type={activeTab}
            initialData={editingItem}
            onSubmit={editingItem ? handleUpdate : handleCreate}
            onCancel={() => {
              setIsFormModalOpen(false);
              setEditingItem(null);
            }}
          />
        </Modal>

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingItem(null);
          }}
          onConfirm={handleDelete}
          title="Konfirmasi Hapus"
          message={`Apakah Anda yakin ingin menghapus ${activeTab === 'berita' ? 'berita' : 'event'} "${deletingItem?.title}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Hapus"
          cancelText="Batal"
          type="danger"
        />

        {/* Notification */}
        <Notification
          show={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ show: false, message: '', type: 'success' })}
        />
      </div>
   
  );
}