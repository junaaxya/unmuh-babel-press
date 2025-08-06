// src/app/admin/dashboard/event/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import NewsEventTable from '@/components/admin/berita-event/NewsEventTable';
import NewsEventForm from '@/components/admin/berita-event/NewsEventForm';
import SearchFilter from '@/components/admin/berita-event/SearchFilter';
import Modal from '@/components/ui/Modal/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal/ConfirmationModal';
import Notification from '@/components/ui/Notification/Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faCalendarDays,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
     setEventPublished,
    setEventUnpublished,
} from '../../../services/api';

export default function EventPage() {
    // State untuk data dan UI
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);

    // State untuk filter dan pagination, sesuai dengan respons API
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_items: 0,
        items_per_page: 10,
    });

  const [notification, setNotification] = useState(null);
const [publishingId, setPublishingId] = useState(null);
        // State baru untuk menampung error form dari backend
    const [formErrors, setFormErrors] = useState(null);

    // Fungsi untuk menampilkan notifikasi
   const showNotification = (message, type = 'success') => {
    // Buat notifikasi baru dengan ID unik (timestamp)
    setNotification({ id: Date.now(), message, type });
};

    // Fungsi untuk mengambil data dari API
    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                page: pagination.current_page,
                limit: pagination.items_per_page,
                search: searchTerm,
                category: categoryFilter === 'all' ? '' : categoryFilter,
                status: statusFilter === 'all' ? '' : statusFilter,
                date_filter: dateFilter === 'all' ? '' : dateFilter,
            };
            Object.keys(params).forEach(
                (key) =>
                    (params[key] === '' || params[key] === null) &&
                    delete params[key]
            );

            const response = await getEvents(params);
            setItems(response.data.items);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Failed to fetch events:', error);
            showNotification(
                error.message || 'Gagal memuat data event.',
                'error'
            );
        } finally {
            setIsLoading(false);
        }
    }, [
        pagination.current_page,
        pagination.items_per_page,
        searchTerm,
        categoryFilter,
        statusFilter,
        dateFilter,
    ]);

    // Panggil fetchEvents saat komponen dimuat atau dependensi berubah
   useEffect(() => {
        // Debounce search
        const handler = setTimeout(() => {
            fetchEvents(1); // Selalu ke halaman 1 saat filter berubah
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, categoryFilter, statusFilter, dateFilter, fetchEvents]);

    // Fungsi untuk membuat event baru
  const handleCreate = async (newItemData) => {
        setFormErrors(null); // Bersihkan error lama setiap kali submit
        try {
            await createEvent(newItemData);
            showNotification('Event berhasil ditambahkan!', 'success');
            handleCloseFormModal();
            fetchEvents();
        } catch (error) {
            if (typeof error === 'object' && error !== null && !error.message) {
                showNotification('Terdapat kesalahan pada isian form. Silakan periksa kembali.', 'error');
                setFormErrors(error);
            } else {
                showNotification(error.message || 'Gagal menambahkan event.', 'error');
            }
        }
    };

    // Fungsi untuk memperbarui event
    const handleUpdate = async (updatedItemData) => {
        if (!editingItem) return;
        try {
            await updateEvent(editingItem.id, updatedItemData);
            showNotification('Event berhasil diperbarui!', 'success');
            handleCloseFormModal();
            fetchEvents(); // Muat ulang data
        } catch (error) {
            console.error('Failed to update event:', error);
            showNotification(
                error.message || 'Gagal memperbarui event.',
                'error'
            );
        }
    };

    // Fungsi untuk menghapus event
    const handleDelete = async () => {
        if (!deletingItem) return;
        try {
            await deleteEvent(deletingItem.id);
            showNotification('Event berhasil dihapus!', 'success');
            handleCloseDeleteModal();
            if (items.length === 1 && pagination.current_page > 1) {
                setPagination((p) => ({
                    ...p,
                    current_page: p.current_page - 1,
                }));
            } else {
                fetchEvents(); // Muat ulang data
            }
        } catch (error) {
            console.error('Failed to delete event:', error);
            showNotification(
                error.message || 'Gagal menghapus event.',
                'error'
            );
        }
    };

     // handler untuk mengubah status publish ---
    const handleStatusChange = async (itemToToggle) => {
        setPublishingId(itemToToggle.id);
        const isCurrentlyPublished = itemToToggle.publishStatus === 'published';

        try {
            if (isCurrentlyPublished) {
                await setEventUnpublished(itemToToggle.id);
                showNotification('Event berhasil dijadikan draf.', 'success');
            } else {
                await setEventPublished(itemToToggle.id);
                showNotification('Event berhasil diterbitkan.', 'success');
            }
            await fetchEvents(); // Muat ulang data untuk memastikan konsistensi
        } catch (error) {
            showNotification(error.message || 'Gagal mengubah status.', 'error');
        } finally {
            setPublishingId(null);
        }
    };

    // Handler untuk UI
    const handlePageChange = (page) => {
        setPagination((p) => ({ ...p, current_page: page }));
    };

    const handleOpenFormModal = (item = null) => {
        setEditingItem(item);
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setEditingItem(null);
    };

    const handleOpenDeleteModal = (item) => {
        setDeletingItem(item);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingItem(null);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setCategoryFilter('all');
        setStatusFilter('all');
        setDateFilter('all');
        // fetchEvents akan terpanggil otomatis oleh useEffect
    };

   // state sementara untuk UI loading ---
    const itemsWithPublishState = items.map(item => ({
        ...item,
        isPublishing: item.id === publishingId,
    }));

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    <FontAwesomeIcon icon={faCalendarDays} className="mr-3" />
                    Kelola Event
                </h1>
                <p className="text-gray-600">
                    Tambah, edit, dan kelola konten event UnmuhBabelPress.
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
                    Tambah Event
                </button>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Total: {pagination.total_items} event</span>
                    {(searchTerm ||
                        categoryFilter !== 'all' ||
                        statusFilter !== 'all' ||
                        dateFilter !== 'all') && (
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
                activeTab="event" // Hardcoded
            />

            {isLoading ? (
                <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm border border-gray-200">
                    <FontAwesomeIcon
                        icon={faSpinner}
                        className="text-blue-500 text-4xl animate-spin"
                    />
                </div>
            ) : (
                <NewsEventTable
                    items={itemsWithPublishState}
                    activeTab="event"
                    onEdit={handleOpenFormModal}
                    onDelete={handleOpenDeleteModal}
                    onStatusChange={handleStatusChange}
                    currentPage={pagination.current_page}
                    totalPages={pagination.total_pages}
                    onPageChange={handlePageChange}
                    totalItems={pagination.total_items}
                    itemsPerPage={pagination.items_per_page}
                />
            )}

            {/* Modals */}
            <Modal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setEditingItem(null);
                }}
                title={`${editingItem ? 'Edit' : 'Tambah'} Event`}
                size="xl"
            >
                <NewsEventForm
                    type="event" // Hardcoded
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
                title="Konfirmasi Hapus Event"
                message={`Apakah Anda yakin ingin menghapus event "${deletingItem?.title}"?`}
                type="danger"
            />

            {notification && (
    <Notification
        // Prop 'id' ini sangat penting untuk memicu animasi
        id={notification.id}
        message={notification.message}
        type={notification.type}
        // Saat notifikasi ditutup (baik otomatis atau manual), set state kembali ke null
        onClose={() => setNotification(null)}
        position="top-right" // Anda bisa mengatur posisi di sini
        autoClose={true}     // Biarkan komponen menangani auto-close
        duration={4000}      // Atur durasi sesuai keinginan
    />
)}
        </div>
    );
}
