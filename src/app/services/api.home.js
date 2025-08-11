// src/app/services/api.home.js
import { apiRequest } from './api';

// GET: Ambil semua data beranda
export const getHomeContent = async () => {
    const data = await apiRequest('/api/beranda');
    const timestamp = Date.now();
    return {
        logoUrl: data.logo,
        heroImageUrl: data.heroImage ? `${data.heroImage}?t=${timestamp}` : null,
        headline: data.herotext?.title || '',
        subheadline: data.herotext?.subtitle || '',
    };
};

// POST: Upload logo
export const uploadLogo = async (file) => {
    const form = new FormData();
    form.append('file', file);
    return apiRequest('/api/beranda/logo', 'POST', form, true);
};

// DELETE: Hapus logo
export const deleteLogo = async () => {
    return apiRequest('/api/beranda/logo', 'DELETE');
};

// POST: Upload hero image
export const uploadHeroImage = async (file) => {
    const form = new FormData();
    form.append('file', file);
    return apiRequest('/api/beranda/hero-image', 'POST', form, true);
};

// DELETE: Hapus hero image
export const deleteHeroImage = async () => {
    return apiRequest('/api/beranda/hero-image', 'DELETE');
};

// PUT: Update hero text
export const updateHeroText = async (payload) => {
    return apiRequest('/api/beranda/hero-text', 'PUT', payload);
};

