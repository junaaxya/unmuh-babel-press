// src/app/services/api.news.js
import { apiRequest } from './api';

// Ambil berita berdasarkan slug
export const getNewsBySlug = async (slug) => {
    return apiRequest(`/api/news/slug/${slug}`);
};

// Ambil daftar berita dengan query params
export const getNews = async (params) => {
    const query = Object.keys(params)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
    return apiRequest(`/api/news?${query}`);
};

// Publish berita
export const setNewsPublished = async (id) => {
    return apiRequest(`/api/news/${id}/publish`, 'PUT');
};

// Unpublish berita
export const setNewsUnpublished = async (id) => {
    return apiRequest(`/api/news/${id}/unpublish`, 'PUT');
};

// Buat berita baru
export const createNews = async (data) => {
    return apiRequest('/api/news', 'POST', data);
};

// Perbarui berita
export const updateNews = async (id, data) => {
    return apiRequest(`/api/news/${id}`, 'PUT', data);
};

// Hapus berita
export const deleteNews = async (id) => {
    return apiRequest(`/api/news/${id}`, 'DELETE');
};

