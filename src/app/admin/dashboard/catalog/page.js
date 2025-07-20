// src/app/admin/catalog/page.js
'use client';

import { useState, useEffect, useMemo } from 'react';
import BookCard from '@/components/admin/dashboard/BookCard/BookCard';
import BookForm from '@/components/admin/dashboard/BookForm/BookForm';
import BookDetailModal from '@/components/admin/dashboard/BookDetailModal/BookDetailModal';
import Modal from '@/components/ui/Modal/Modal';
import SearchFilter from '@/components/admin/dashboard/SearchFilter/SearchFilter';
import ConfirmationModal from '@/components/ui/ConfirmationModal/ConfirmationModal';
import dummyBooks from '@/data/dummyBooks';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faBook,
    faThLarge,
    faList,
    faSpinner,
    faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';

// Mock data untuk simulasi
const initialBooks = dummyBooks;

const AdminCatalogPage = () => {
    // State management
    const [books, setBooks] = useState(initialBooks);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [isLoading, setIsLoading] = useState(false);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Simulate loading state
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPageLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Filter books based on search and category
    const filteredBooks = useMemo(() => {
        return books.filter((book) => {
            const matchesSearch =
                !searchTerm ||
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.Penulis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.ISBN.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory =
                !selectedCategory || book.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [books, searchTerm, selectedCategory]);

    // Simulate API calls
    const simulateApiCall = (delay = 1000) => {
        return new Promise((resolve) => setTimeout(resolve, delay));
    };

    // CRUD Operations
    const handleAddBook = async (bookData) => {
        setIsLoading(true);
        try {
            await simulateApiCall(1500);

            const newBook = {
                id: Date.now(),
                ...bookData,
                cover: bookData.cover
                    ? URL.createObjectURL(bookData.cover)
                    : null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            setBooks((prev) => [newBook, ...prev]);
            setIsAddModalOpen(false);

            // Show success notification (you can implement a toast notification here)
            alert('Buku berhasil ditambahkan!');
        } catch (error) {
            alert('Gagal menambahkan buku. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditBook = async (bookData) => {
        setIsLoading(true);
        try {
            await simulateApiCall(1500);

            const updatedBook = {
                ...selectedBook,
                ...bookData,
                cover: bookData.cover
                    ? URL.createObjectURL(bookData.cover)
                    : selectedBook.cover,
                updatedAt: new Date(),
            };

            setBooks((prev) =>
                prev.map((book) =>
                    book.id === selectedBook.id ? updatedBook : book
                )
            );

            setIsEditModalOpen(false);
            setSelectedBook(null);

            alert('Buku berhasil diperbarui!');
        } catch (error) {
            alert('Gagal memperbarui buku. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteBook = async () => {
        setIsLoading(true);
        try {
            await simulateApiCall(1000);

            setBooks((prev) =>
                prev.filter((book) => book.id !== selectedBook.id)
            );
            setIsDeleteModalOpen(false);
            setSelectedBook(null);

            alert('Buku berhasil dihapus!');
        } catch (error) {
            alert('Gagal menghapus buku. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    // Event handlers
    const handleViewBook = (book) => {
        setSelectedBook(book);
        setIsDetailModalOpen(true);
    };

    const handleEditClick = (book) => {
        setSelectedBook(book);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (book) => {
        setSelectedBook(book);
        setIsDeleteModalOpen(true);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
    };

    if (pageLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <FontAwesomeIcon
                        icon={faSpinner}
                        className="h-8 w-8 animate-spin text-blue-600 mb-4"
                    />
                    <p className="text-gray-600">Memuat data katalog...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <FontAwesomeIcon
                            icon={faBook}
                            className="mr-3 text-blue-600"
                        />
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
                            <FontAwesomeIcon
                                icon={faThLarge}
                                className="h-4 w-4"
                            />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors ${
                                viewMode === 'list'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <FontAwesomeIcon
                                icon={faList}
                                className="h-4 w-4"
                            />
                        </button>
                    </div>

                    {/* Add Book Button */}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Tambah Buku
                    </button>
                </div>
            </div>

            {/* Search and Filter */}
            <SearchFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onClearFilters={handleClearFilters}
                totalBooks={books.length}
                filteredBooks={filteredBooks.length}
            />

            {/* Books Grid/List */}
            {filteredBooks.length === 0 ? (
                <div className="text-center py-12">
                    <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="h-12 w-12 text-gray-400 mb-4"
                    />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Tidak ada buku ditemukan
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm || selectedCategory
                            ? 'Coba ubah kriteria pencarian atau filter Anda.'
                            : 'Belum ada buku yang ditambahkan ke katalog.'}
                    </p>
                    {!searchTerm && !selectedCategory && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            Tambah Buku Pertama
                        </button>
                    )}
                </div>
            ) : (
                <div
                    className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                            : 'space-y-4'
                    }
                >
                    {filteredBooks.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            onView={handleViewBook}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            {/* Add Book Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Tambah Buku Baru"
                size="xl"
            >
                <BookForm
                    onSubmit={handleAddBook}
                    onCancel={() => setIsAddModalOpen(false)}
                    isLoading={isLoading}
                />
            </Modal>

            {/* Edit Book Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Buku"
                size="xl"
            >
                <BookForm
                    book={selectedBook}
                    onSubmit={handleEditBook}
                    onCancel={() => setIsEditModalOpen(false)}
                    isLoading={isLoading}
                />
            </Modal>

            {/* Book Detail Modal */}
            <BookDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                book={selectedBook}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteBook}
                title="Hapus Buku"
                message={`Apakah Anda yakin ingin menghapus buku "${selectedBook?.title}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Ya, Hapus"
                cancelText="Batal"
                type="danger"
                isLoading={isLoading}
            />
        </div>
    );
};

export default AdminCatalogPage;
