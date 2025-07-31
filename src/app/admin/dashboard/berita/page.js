// src/app/admin/dashboard/berita/page.js
'use client';

import { useState, useEffect } from 'react';
import NewsEventTable from '@/components/admin/berita-event/NewsEventTable';
import NewsEventForm from '@/components/admin/berita-event/NewsEventForm';
import SearchFilter from '@/components/admin/berita-event/SearchFilter';
import Modal from '@/components/ui/Modal/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal/ConfirmationModal';
import Notification from '@/components/ui/Notification/Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faNewspaper } from '@fortawesome/free-solid-svg-icons';

// Import dummy data
import newsData from '@/data/news';

export default function BeritaPage() {
  // State management (hanya untuk berita)
  const [items, setItems] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Inisialisasi data
  useEffect(() => {
    setItems(newsData);
  }, []);

  // Filter items (disederhanakan)
  const getFilteredItems = () => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      filtered = filtered.filter(item => new Date(item.date) >= filterDate);
    }
    return filtered;
  };

  // Pagination
  const getPaginatedItems = () => {
    const filteredItems = getFilteredItems();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  };
  const getTotalPages = () => Math.ceil(getFilteredItems().length / itemsPerPage);

  // CRUD (disederhanakan)
  const handleCreate = (newItem) => {
    const itemWithId = { ...newItem, id: Date.now() };
    setItems(prev => [...prev, itemWithId]);
    setIsFormModalOpen(false);
    showNotification('Berita berhasil ditambahkan!', 'success');
  };

  const handleUpdate = (updatedItem) => {
    setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    setIsFormModalOpen(false);
    setEditingItem(null);
    showNotification('Berita berhasil diperbarui!', 'success');
  };

  const handleDelete = () => {
    setItems(prev => prev.filter(item => item.id !== deletingItem.id));
    setIsDeleteModalOpen(false);
    setDeletingItem(null);
    showNotification('Berita berhasil dihapus!', 'success');
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
  
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setDateFilter('all');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <FontAwesomeIcon icon={faNewspaper} className="mr-3" />
          Kelola Berita
        </h1>
        <p className="text-gray-600">
          Tambah, edit, dan kelola konten berita UnmuhBabelPress.
        </p>
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
          Tambah Berita
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Total: {getFilteredItems().length} berita</span>
            {(searchTerm || categoryFilter !== 'all' || dateFilter !== 'all') && (
              <button onClick={resetFilters} className="text-blue-600 hover:text-blue-800 underline">
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
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        activeTab="berita" // Hardcoded
      />

      {/* Table */}
      <NewsEventTable
        items={getPaginatedItems()}
        activeTab="berita" // Hardcoded
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
        onClose={() => { setIsFormModalOpen(false); setEditingItem(null); }}
        title={`${editingItem ? 'Edit' : 'Tambah'} Berita`}
        size="xl"
      >
        <NewsEventForm
          type="berita" // Hardcoded
          initialData={editingItem}
          onSubmit={editingItem ? handleUpdate : handleCreate}
          onCancel={() => { setIsFormModalOpen(false); setEditingItem(null); }}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setDeletingItem(null); }}
        onConfirm={handleDelete}
        title="Konfirmasi Hapus Berita"
        message={`Apakah Anda yakin ingin menghapus berita "${deletingItem?.title}"?`}
        type="danger"
      />

      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ show: false, message: '', type: 'success' })}
      />
    </div>
  );
}