// /services/api.js


const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Fungsi request umum dengan penanganan error yang disempurnakan
async function apiRequest(url, method = 'GET', body = null, isFormData = false) {
    const headers = {};

    if (body && !isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const isServer = typeof window === 'undefined';
    const fullUrl = isServer ? `${BASE_URL}${url}` : url;

    try {
        const res = await fetch(fullUrl, {
            method,
            headers,
            credentials: 'include',
            body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
        });

        if (res.ok) {
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return res.json();
            }
            return { status: 'success', message: 'Operation successful' };
        }

        // Jika response tidak OK, lempar error agar bisa ditangkap blok catch
        const errorText = await res.text();
        throw new Error(errorText);

    } catch (error) {
        // --- START OF CHANGE ---
        // Tujuan: Melempar objek error (fieldErrors) dari Zod, bukan string.
        try {
            const errorBody = JSON.parse(error.message);
            // Jika ada fieldErrors, lempar objek itu. Ini kuncinya.
            if (errorBody && errorBody.errors && errorBody.errors.fieldErrors) {
                throw errorBody.errors.fieldErrors;
            }
        } catch (e) {
            // Jika gagal parse (bukan error dari Zod), biarkan error asli yang dilempar
        }
        
        // Lemparkan error asli jika tidak ada fieldErrors terstruktur
        throw error;
        // --- END OF CHANGE ---
    }
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

// ====================================================================
// ||                TAMBAHAN UNTUK BERITA & EVENT                   ||
// ====================================================================

// --- FUNGSI BARU UNTUK HALAMAN DETAIL ---
// Fungsi ini akan mengambil satu berita berdasarkan slug-nya.
export const getNewsBySlug = async (slug) => {
    // Kita gunakan apiRequest agar error handling dan base URL konsisten.
    return apiRequest(`/api/news/slug/${slug}`);
};
// Fungsi ini akan mengirim file ke backend , bukan ke Cloudinary langsung.
export const uploadImage = async (file, folder) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    // Menggunakan apiRequest untuk mengirim data form ke endpoint backend Anda
    // Endpoint ini sekarang menggunakan metode POST dan mengirim FormData
    return apiRequest('/api/upload-signature', 'POST', formData, true);
};


// --- News API ---
export const getNews = async (params) => {
    const query = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
    return apiRequest(`/api/news?${query}`);
};

// Fungsi untuk mempublikasikan berita
export const setNewsPublished = async (id) => {
    // Memanggil endpoint PUT khusus untuk publish
    return apiRequest(`/api/news/${id}/publish`, 'PUT');
};

// Fungsi untuk menjadikan berita sebagai draf
export const setNewsUnpublished = async (id) => {
    // Memanggil endpoint PUT khusus untuk unpublish
    return apiRequest(`/api/news/${id}/unpublish`, 'PUT');
};

export const createNews = async (data) => {
    return apiRequest('/api/news', 'POST', data);
};

export const updateNews = async (id, data) => {
    return apiRequest(`/api/news/${id}`, 'PUT', data);
};

export const deleteNews = async (id) => {
    return apiRequest(`/api/news/${id}`, 'DELETE');
};

// --- Events API ---
export const getEventBySlug = async (slug) => {
    return apiRequest(`/api/events/slug/${slug}`);
};

export const getEvents = async (params) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/events?${query}`);
};

export const createEvent = async (data) => {
    return apiRequest('/api/events', 'POST', data);
};

export const updateEvent = async (id, data) => {
    return apiRequest(`/api/events/${id}`, 'PUT', data);
};

export const deleteEvent = async (id) => {
    return apiRequest(`/api/events/${id}`, 'DELETE');
};

export const setEventPublished = async (id) => {
    return apiRequest(`/api/events/${id}/publish`, 'PUT');
};

export const setEventUnpublished = async (id) => {
    return apiRequest(`/api/events/${id}/unpublish`, 'PUT');
};
