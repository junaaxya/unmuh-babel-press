// src/app/admin/dashboard/catalog/page.js
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useDebounce } from 'use-debounce';
import BookCard from '@/components/admin/dashboard/BookCard/BookCard';
import BookForm from '@/components/admin/dashboard/BookForm/BookForm'; 
import BookDetailModal from '@/components/admin/dashboard/BookDetailModal/BookDetailModal';
import Modal from '@/components/ui/Modal/Modal';
import SearchFilter from '@/components/admin/dashboard/SearchFilter/SearchFilter';
import ConfirmationModal from '@/components/ui/ConfirmationModal/ConfirmationModal';
import Notification from '@/components/ui/Notification/Notification';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faBook,
    faThLarge,
    faList,
    faSpinner,
    faExclamationCircle,
    faChevronLeft,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import {
    getBooks,
    createBook,
    updateBook,
    deleteBook,
    getBookCategories,
    publishBook,
    unpublishBook,
} from '../../../services/api';
import { calculatePaginationRange } from '@/lib/pagination';

const AdminCatalogPage = () => {
    // State untuk data dan UI
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [selectedBook, setSelectedBook] = useState(null);

    // --- State untuk Modals ---
    // isFormModalOpen digunakan untuk modal Tambah dan Edit
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // State terpisah untuk modal detail
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);


    // State untuk loading dan error
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pageError, setPageError] = useState(null);
    const [apiErrors, setApiErrors] = useState({});
    

    // State untuk notifikasi global
    const [notification, setNotification] = useState({
        id: null,
        type: '',
        message: '',
    });

    // Fungsi untuk menampilkan notifikasi
    const showNotification = (type, message) => {
        setNotification({ id: Date.now(), type, message });
    };

    // State untuk filter dan paginasi
    const [filters, setFilters] = useState({
        search: '',
        kategori: '',
        status: 'all',
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        total_pages: 1,
    });
    const [debouncedSearch] = useDebounce(filters.search, 500);

    // Ambil role dari session untuk menentukan izin
    const { data: session } = useSession();
    const role = session?.user?.role || 'VIEWER';
    const canEdit = role === 'ADMIN' || role === 'EDITOR';

    // Fungsi untuk mengambil data buku dari API
    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        setPageError(null);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                search: debouncedSearch,
                kategori: filters.kategori,
                status: filters.status,
            };
            Object.keys(params).forEach(
                (key) =>
                    (params[key] === '' || params[key] === null) &&
                    delete params[key]
            );

            const response = await getBooks(params);
            const { data = [], meta = {} } = response || {};
            const total = Number(meta.total) || 0;
            const limit = Number(meta.limit) || pagination.limit;
            const requestedPage = Number(params.page) || 1;
            const totalPagesFromMeta = Number(meta.total_pages);
            const calculatedTotalPages =
                Number.isFinite(totalPagesFromMeta) && totalPagesFromMeta > 0
                    ? totalPagesFromMeta
                    : total > 0
                      ? Math.ceil(total / Math.max(limit, 1))
                      : 1;

            if (total > 0 && requestedPage > calculatedTotalPages) {
                setPagination((prev) => ({
                    ...prev,
                    total,
                    limit,
                    total_pages: calculatedTotalPages,
                    page: calculatedTotalPages,
                }));
                return;
            }

            setBooks(data);
            setPagination((prev) => ({
                ...prev,
                total,
                limit,
                total_pages: calculatedTotalPages,
                page:
                    Number(meta.page) && Number(meta.page) > 0
                        ? Number(meta.page)
                        : requestedPage,
            }));
        } catch (err) {
            const message = err.message || 'Gagal memuat data buku.';
            setPageError(message);
            showNotification('error', message);
        } finally {
            setIsLoading(false);
        }
    }, [
        pagination.page,
        pagination.limit,
        debouncedSearch,
        filters.kategori,
        filters.status,
    ]);

    // Fetch books on component mount or when filters/page change
    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    // Fetch categories on mount
   useEffect(() => {
    const fetchCategories = async () => {
        try {
            const cats = await getBookCategories();
            setCategories(cats);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            showNotification('warning', 'Gagal memuat daftar kategori.');
        }
    };
    fetchCategories();
}, []);

    // --- Handlers untuk membuka modal ---
    const handleOpenAddModal = () => {
        if (!canEdit) return;
        setSelectedBook(null);
        setApiErrors({});
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (book) => {
        if (!canEdit) return;
        setSelectedBook(book);
        setApiErrors({});
        setIsFormModalOpen(true);
    };

    const handleOpenDeleteModal = (book) => {
        if (!canEdit) return;
        setSelectedBook(book);
        setIsDeleteModalOpen(true);
    };

    const handleViewBook = (book) => {
        setSelectedBook(book);
        setIsDetailModalOpen(true);
    };

    // --- Handler untuk menutup semua modal ---
    const handleCloseModals = () => {
        setIsFormModalOpen(false);
        setIsDeleteModalOpen(false);
        setIsDetailModalOpen(false);
        setSelectedBook(null); // Selalu reset selectedBook saat modal ditutup
    };

    // --- Handler untuk submit form (Create & Update) ---
   const handleFormSubmit = async (formData) => {
        if (!canEdit) return; // Viewer tidak boleh menambah/mengedit buku
        setIsSubmitting(true);
        setApiErrors({});
        const isEditing = !!selectedBook;
        const actionText = isEditing ? 'memperbarui' : 'menambahkan';

        try {
            if (isEditing) {
                await updateBook(selectedBook.id, formData);
            } else {
                await createBook(formData);
            }
            showNotification('success', `Buku berhasil ${actionText}.`);
            handleCloseModals();
            fetchBooks(); // Refresh data
        } catch (err) {
            const errorMessage = err.message || `Gagal ${actionText} buku. Silakan coba lagi.`;
            showNotification('error', errorMessage);
            if (typeof err === 'object' && err !== null && err.fieldErrors) {
                setApiErrors(err.fieldErrors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Handler untuk menghapus buku ---
     const handleDeleteBook = async () => {
        if (!canEdit || !selectedBook) return; // Viewer tidak boleh menghapus
        setIsSubmitting(true);
        try {
            await deleteBook(selectedBook.id);
            showNotification('success', 'Buku berhasil dihapus.');
            handleCloseModals();
            fetchBooks();
        } catch (err) {
            showNotification('error', err.message || 'Gagal menghapus buku.');
        } finally {
            setIsSubmitting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleToggleStatus = async (book) => {
        if (!canEdit) return; // Viewer tidak boleh mengubah status buku
        const isPublishing = book.status !== 'published';
        const actionText = isPublishing ? 'dipublikasikan' : 'diubah menjadi draf';

        try {
            if (isPublishing) {
                await publishBook(book.id);
            } else {
                await unpublishBook(book.id);
            }
            showNotification('success', `Buku berhasil ${actionText}.`);
            fetchBooks();
        } catch (err) {
            showNotification('error', err.message || `Gagal mengubah status buku.`);
        }
    };

    // --- Handlers untuk filter ---
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPagination((prev) => ({ ...prev, page: 1 }));
    };
    
    // Fungsi baru untuk membersihkan filter
    const handleClearFilters = () => {
        setFilters({
            search: '',
            kategori: '',
            status: 'all',
        });
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handlePageChange = useCallback((newPage) => {
        setPagination((prev) => {
            const totalPages = prev.total_pages || 1;
            const nextPage = Math.min(Math.max(newPage, 1), totalPages);

            if (nextPage === prev.page) {
                return prev;
            }

            return { ...prev, page: nextPage };
        });
    }, []);

    const paginationRange = useMemo(
        () =>
            calculatePaginationRange({
                page: pagination.page,
                limit: pagination.limit,
                total: pagination.total,
                currentCount: books.length,
            }),
        [books.length, pagination.limit, pagination.page, pagination.total]
    );

    const visiblePageItems = useMemo(() => {
        const totalPages = pagination.total_pages || 1;
        const currentPage = pagination.page || 1;

        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        const pages = new Set([1, totalPages, currentPage]);

        for (let offset = 1; offset <= 2; offset += 1) {
            pages.add(currentPage - offset);
            pages.add(currentPage + offset);
        }

        const sortedPages = Array.from(pages)
            .filter((page) => page >= 1 && page <= totalPages)
            .sort((a, b) => a - b);

        return sortedPages.reduce((acc, page, index) => {
            if (index === 0) {
                acc.push(page);
                return acc;
            }

            const previous = sortedPages[index - 1];

            if (page - previous > 1) {
                acc.push('ellipsis');
            }

            acc.push(page);
            return acc;
        }, []);
    }, [pagination.page, pagination.total_pages]);

    return (
        <div className="space-y-6">
            {notification.id && (
                <Notification
                    id={notification.id}
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification({ id: null, type: '', message: '' })}
                />
            )}
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <FontAwesomeIcon icon={faBook} className="mr-3 text-blue-600" />
                        Katalog Buku
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Kelola koleksi buku Universitas Muhammadiyah Babel Press
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    {/* View Mode Toggle */}
                    <div className="flex rounded-lg border border-gray-300 p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors ${
                                viewMode === 'grid'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <FontAwesomeIcon icon={faThLarge} className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors ${
                                viewMode === 'list'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <FontAwesomeIcon icon={faList} className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Tombol Tambah Buku */}
                    {canEdit && (
                        <button
                            onClick={handleOpenAddModal}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            Tambah Buku
                        </button>
                    )}
                </div>
            </div>

            {/* Search and Filter (sudah diperbaiki) */}
            <SearchFilter
                searchTerm={filters.search}
                categories={categories}
                onSearchChange={(value) => handleFilterChange('search', value)}
                selectedCategory={filters.kategori}
                onCategoryChange={(value) => handleFilterChange('kategori', value)}
                onClearFilters={handleClearFilters}
                totalBooks={pagination.total}
                filteredBooks={books.length}
                rangeStart={paginationRange.start}
                rangeEnd={paginationRange.end}
                isLoading={isLoading}
            />

            {/* Kondisi Loading */}
            {isLoading ? (
                 <div className="text-center py-12">
                     <FontAwesomeIcon icon={faSpinner} className="h-12 w-12 text-gray-400 animate-spin mb-4" />
                     <p className="text-gray-600">Memuat data buku...</p>
                 </div>
            ) : pageError ? (
                 <div className="text-center py-12 text-red-500">
                     <FontAwesomeIcon icon={faExclamationCircle} className="h-12 w-12 mb-4" />
                     <p>{pageError}</p>
                 </div>
            ) : books.length === 0 ? (
                // Tampilan jika tidak ada buku (sudah diperbaiki)
                <div className="text-center py-12">
                    <FontAwesomeIcon icon={faExclamationCircle} className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Tidak ada buku ditemukan
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {filters.search || filters.kategori
                            ? 'Coba ubah kriteria pencarian atau filter Anda.'
                            : 'Belum ada buku yang ditambahkan ke katalog.'}
                    </p>
                    {!filters.search && !filters.kategori && canEdit && (
                        <button
                            onClick={handleOpenAddModal}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            Tambah Buku Pertama
                        </button>
                    )}
                </div>
            ) : (
                // Daftar Buku (sudah diperbaiki)
                <>
                    <div
                        className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                : 'space-y-4'
                        }
                    >
                        {books.map((book) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                onView={() => handleViewBook(book)}
                                onEdit={() => handleOpenEditModal(book)}
                                onDelete={() => handleOpenDeleteModal(book)}
                                onToggleStatus={handleToggleStatus}
                                readOnly={!canEdit}
                            />
                        ))}
                    </div>

                    {pagination.total > 0 && pagination.total_pages > 1 && (
                        <div className="mt-6 bg-white border border-gray-200 rounded-lg px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <p className="text-sm text-gray-600">
                                Menampilkan{' '}
                                <span className="font-medium">{paginationRange.start}</span>
                                {' '}-{' '}
                                <span className="font-medium">{paginationRange.end}</span>
                                {' '}dari{' '}
                                <span className="font-medium">{pagination.total}</span>{' '}
                                buku
                            </p>

                            <div className="flex items-center gap-1 sm:gap-2 justify-center sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1 || isLoading}
                                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
                                </button>

                                {visiblePageItems.map((item, index) =>
                                    item === 'ellipsis' ? (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="px-2 text-sm text-gray-400"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={`page-${item}`}
                                            type="button"
                                            onClick={() => handlePageChange(item)}
                                            disabled={isLoading}
                                            className={`inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                                                pagination.page === item
                                                    ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm'
                                                    : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {item}
                                        </button>
                                    )
                                )}

                                <button
                                    type="button"
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.total_pages || isLoading}
                                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
            
            {/* Modal untuk Tambah & Edit Buku */}
            <Modal
                isOpen={isFormModalOpen}
                onClose={handleCloseModals}
                title={selectedBook ? 'Edit Buku' : 'Tambah Buku Baru'}
                size="xl"
            >
                <BookForm
                    book={selectedBook}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModals}
                    isLoading={isSubmitting}
                    apiErrors={apiErrors}
                    showNotification={showNotification}     
                />
            </Modal>

            {/* Modal Detail Buku */}
            <BookDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseModals}
                book={selectedBook}
            />

            {/* Modal Konfirmasi Hapus */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseModals}
                onConfirm={handleDeleteBook}
                title="Hapus Buku"
                message={`Apakah Anda yakin ingin menghapus buku "${selectedBook?.title}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Ya, Hapus"
                cancelText="Batal"
                type="danger"
                isLoading={isSubmitting}
            />
        </div>
    );
};

export default AdminCatalogPage;