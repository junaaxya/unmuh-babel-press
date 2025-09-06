// src/app/admin/dashboard/berita/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import NewsEventTable from '@/components/admin/berita-event/NewsEventTable';
import NewsEventForm from '@/components/admin/berita-event/NewsEventForm';
import SearchFilter from '@/components/admin/berita-event/SearchFilter';
import Modal from '@/components/ui/Modal/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal/ConfirmationModal';
import Notification from '@/components/ui/Notification/Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faNewspaper, faSpinner } from '@fortawesome/free-solid-svg-icons';
// Import fungsi API yang sesungguhnya
import { getNews, createNews, updateNews, deleteNews,setNewsPublished, setNewsUnpublished } from '../../../services/api';

export default function BeritaPage() {
  // State untuk data dan UI
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [publishingId, setPublishingId] = useState(null);
  
  // State untuk filter dan pagination, sesuai dengan respons API
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10,
  });

  const [notification, setNotification] = useState(null);

  // Ambil role dari sesi untuk menentukan izin
  const { data: session } = useSession();
  const role = session?.user?.role || 'VIEWER';
  const canEdit = role === 'ADMIN' || role === 'EDITOR';

  // Fungsi untuk menampilkan notifikasi
  const showNotification = (message, type = 'success') => {
    // Buat notifikasi baru dengan ID unik (timestamp)
    setNotification({ id: Date.now(), message, type });
};

  // Fungsi untuk mengambil data dari API
  const fetchBerita = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: pagination.current_page,
        limit: pagination.items_per_page,
        search: searchTerm,
        // Kirim string kosong jika filter 'all'
        category: categoryFilter === 'all' ? '' : categoryFilter,
        date_filter: dateFilter === 'all' ? '' : dateFilter,
      };
      // Hapus parameter kosong agar URL lebih bersih
      Object.keys(params).forEach(key => (params[key] === '' || params[key] === null) && delete params[key]);

      const response = await getNews(params);
      // Kita buat properti `publishStatus` dari `status` yang ada.
      const transformedItems = response.data.items.map(item => ({
        ...item,
        publishStatus: item.status, // Salin nilai dari 'status' ke 'publishStatus'
      }));

      setItems(transformedItems); 
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch news:", error);
      showNotification(error.message || 'Gagal memuat data berita.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.current_page, pagination.items_per_page, searchTerm, categoryFilter, dateFilter]);

  // Panggil fetchBerita saat komponen dimuat atau dependensi berubah
  useEffect(() => {
    fetchBerita();
  }, [fetchBerita]);

  // Fungsi untuk membuat berita baru
  const handleCreate = async (newItemData) => {
    if (!canEdit) return; // Viewer tidak boleh membuat berita
    try {
      await createNews(newItemData);
      showNotification(`Berita berhasil disimpan sebagai ${newItemData.status}.`, 'success');
      handleCloseFormModal();
      fetchBerita();
    } catch (error) {
      console.error("Failed to create news:", error);
      showNotification(error.message || 'Gagal menambahkan berita.', 'error');
    }
  };

  // Fungsi untuk memperbarui berita
  const handleUpdate = async (updatedItemData) => {
    if (!canEdit || !editingItem) return; // Viewer tidak boleh mengedit
    try {
      await updateNews(editingItem.id, updatedItemData);
      showNotification('Berita berhasil diperbarui!', 'success');
      handleCloseFormModal();
      fetchBerita(); // Muat ulang data untuk menampilkan perubahan
    } catch (error) {
      console.error("Failed to update news:", error);
      showNotification(error.message || 'Gagal memperbarui berita.', 'error');
    }
  };

  // Fungsi untuk menghapus berita
  const handleDelete = async () => {
    if (!canEdit || !deletingItem) return; // Viewer tidak boleh menghapus
    try {
      await deleteNews(deletingItem.id);
      showNotification('Berita berhasil dihapus!', 'success');
      handleCloseDeleteModal();
      // Cek jika item terakhir di halaman ini dihapus, pindah ke halaman sebelumnya
      if (items.length === 1 && pagination.current_page > 1) {
        setPagination(p => ({ ...p, current_page: p.current_page - 1 }));
      } else {
        fetchBerita(); // Muat ulang data
      }
    } catch (error) {
      console.error("Failed to delete news:", error);
      showNotification(error.message || 'Gagal menghapus berita.', 'error');
    }
  };


 // Fungsi ini sekarang memanggil endpoint yang sesuai
  const handleStatusChange = async (itemToToggle) => {
    if (!canEdit) return; // Viewer tidak boleh mengubah status
    setPublishingId(itemToToggle.id);
    const isCurrentlyPublished = itemToToggle.status === 'published';

    try {
      if (isCurrentlyPublished) {
        // Jika sedang published, panggil unpublish
        await setNewsUnpublished(itemToToggle.id);
        showNotification('Berita berhasil dijadikan draf.', 'success');
      } else {
        // Jika sedang draft, panggil publish
        await setNewsPublished(itemToToggle.id);
        showNotification('Berita berhasil diterbitkan.', 'success');
      }

      // Panggil ulang fetchBerita untuk mendapatkan data terbaru dari server
      // Ini lebih aman daripada mengubah state secara manual
      await fetchBerita();

    } catch (error) {
      console.error("Gagal mengubah status:", error);
      showNotification(error.message || 'Gagal mengubah status.', 'error');
    } finally {
      setPublishingId(null);
    }
  };
  
  // Handler untuk UI
  const handlePageChange = (page) => {
    setPagination(p => ({ ...p, current_page: page }));
  };

  const handleOpenFormModal = (item = null) => {
    if (!canEdit) return;
    setEditingItem(item);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingItem(null);
  };
  
  const handleOpenDeleteModal = (item) => {
    if (!canEdit) return;
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingItem(null);
  };

   // Menambahkan state 'isPublishing' sementara ke item untuk UI
  const itemsWithPublishState = items.map(item => ({
    ...item,
    isPublishing: item.id === publishingId,
  }));

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
        {canEdit && (
          <button
            onClick={() => handleOpenFormModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            Tambah Berita
          </button>
        )}
      </div>
      
      {/* Search and Filters */}
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        activeTab="berita"
      />

      {/* Table atau Loading Spinner */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm border border-gray-200">
          <FontAwesomeIcon icon={faSpinner} className="text-blue-500 text-4xl animate-spin" />
        </div>
      ) : (
        <NewsEventTable
          items={items}
          activeTab="berita"
          onEdit={handleOpenFormModal}
          onDelete={handleOpenDeleteModal}
          onStatusChange={handleStatusChange}
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          onPageChange={handlePageChange}
          totalItems={pagination.total_items}
          itemsPerPage={pagination.items_per_page}
          readOnly={!canEdit}
        />
      )}

      {/* Modals */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={`${editingItem ? 'Edit' : 'Tambah'} Berita`}
        size="3xl"
      >
        <NewsEventForm
          type="berita"
          initialData={editingItem}
          onSubmit={editingItem ? handleUpdate : handleCreate}
          onCancel={handleCloseFormModal}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="Konfirmasi Hapus Berita"
        message={`Apakah Anda yakin ingin menghapus berita "${deletingItem?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        type="danger"
      />
{notification && (
  <Notification
    id={notification.id}
    message={notification.message}
    type={notification.type}
    onClose={() => setNotification(null)}
    autoClose={true}
    duration={4000}
  />
)}
    </div>
  );
}
