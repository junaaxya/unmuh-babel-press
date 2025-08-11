// src/app/services/api.books.js
import { apiRequest } from './api';

// Ambil daftar buku dengan filter dan paginasi
export const getBooks = (params) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/books?${query}`);
};

// Ambil detail buku berdasarkan ID
export const getBookById = (id) => {
    return apiRequest(`/api/books/${id}`);
};

// Membuat buku baru
export const createBook = (formData) => {
    return apiRequest('/api/books', 'POST', formData, true);
};

// Memperbarui buku
export const updateBook = (id, formData) => {
    return apiRequest(`/api/books/${id}`, 'PUT', formData, true);
};

// Menghapus buku
export const deleteBook = (id) => {
    return apiRequest(`/api/books/${id}`, 'DELETE');
};

// Mengubah status buku menjadi published
export const publishBook = (id) => {
    return apiRequest(`/api/books/${id}/publish`, 'PUT');
};

// Mengubah status buku menjadi draft
export const unpublishBook = (id) => {
    return apiRequest(`/api/books/${id}/unpublish`, 'PUT');
};

// Ambil daftar kategori buku
export const getBookCategories = async () => {
    const response = await apiRequest('/api/books/categories');
    return response.data || [];
};

// Upload cover buku ke Cloudinary via backend
export const uploadCoverImage = (file, folder = 'books') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return apiRequest('/api/upload-signature', 'POST', formData, true);
};

