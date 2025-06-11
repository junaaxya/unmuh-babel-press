// /services/api.js

// Fungsi request umum
async function apiRequest(url, method = 'GET', body = null, isFormData = false) {
    const headers = {};

    if (body && !isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, {
        method,
        headers,
        credentials: 'include', // ⬅️ penting: agar cookie HttpOnly ikut terkirim
        body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });

    if (!res.ok) {
        const errorMsg = await res.text();
        throw new Error(errorMsg || 'Terjadi kesalahan pada permintaan API');
    }

    return res.json();
}

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
    return await apiRequest('/api/beranda/logo', 'POST', form, true);
};

// DELETE: Hapus logo
export const deleteLogo = async () => {
    return await apiRequest('/api/beranda/logo', 'DELETE');
};

// POST: Upload hero image
export const uploadHeroImage = async (file) => {
    const form = new FormData();
    form.append('file', file);
    return await apiRequest('/api/beranda/hero-image', 'POST', form, true);
};

// DELETE: Hapus hero image
export const deleteHeroImage = async () => {
    return await apiRequest('/api/beranda/hero-image', 'DELETE');
};

// PUT: Update hero text
export const updateHeroText = async (payload) => {
    return await apiRequest('/api/beranda/hero-text', 'PUT', payload);
};
