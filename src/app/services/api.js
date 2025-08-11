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

// Settings API
export const getSettings = async () => {
    return apiRequest('/api/settings');
};

export const updateSettings = async (data) => {
    return apiRequest('/api/settings', 'PUT', data);
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

// ====================================================================
// ||                    API UNTUK KATALOG BUKU                      ||
// ====================================================================

/**
 * Mengambil daftar buku dengan filter dan paginasi.
 * @param {object} params - Query params (search, kategori, status, page, limit).
 * @returns {Promise<object>} - Response dari API { data: [], meta: {} }.
 */
export const getBooks = (params) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/books?${query}`);
};

/**
 * Mengambil detail satu buku berdasarkan ID.
 * @param {string|number} id - ID buku.
 * @returns {Promise<object>} - Data buku.
 */
export const getBookById = (id) => {
    return apiRequest(`/api/books/${id}`);
};

/**
 * Membuat buku baru. Menggunakan FormData karena ada file upload.
 * @param {FormData} formData - Data buku dalam bentuk FormData.
 * @returns {Promise<object>} - Data buku yang baru dibuat.
 */
export const createBook = (formData) => {
    return apiRequest('/api/books', 'POST', formData, true);
};

/**
 * Memperbarui buku yang sudah ada. Menggunakan FormData.
 * @param {string|number} id - ID buku yang akan diupdate.
 * @param {FormData} formData - Data buku yang baru.
 * @returns {Promise<object>} - Data buku yang sudah diupdate.
 */
export const updateBook = (id, formData) => {
    // Untuk PUT dengan FormData, beberapa backend memerlukan method POST dengan _method=PUT
    // Namun, kita coba dengan PUT langsung sesuai standar REST. Jika gagal, ini perlu disesuaikan.
    return apiRequest(`/api/books/${id}`, 'PUT', formData, true);
};

/**
 * Menghapus buku berdasarkan ID.
 * @param {string|number} id - ID buku.
 * @returns {Promise<object>} - Pesan sukses.
 */
export const deleteBook = (id) => {
    return apiRequest(`/api/books/${id}`, 'DELETE');
};

/**
 * Mengubah status buku menjadi 'published'.
 * @param {string|number} id - ID buku.
 * @returns {Promise<object>} - Data buku dengan status baru.
 */
export const publishBook = (id) => {
    return apiRequest(`/api/books/${id}/publish`, 'PUT');
};

/**
 * Mengubah status buku menjadi 'draft'.
 * @param {string|number} id - ID buku.
 * @returns {Promise<object>} - Data buku dengan status baru.
 */
export const unpublishBook = (id) => {
    return apiRequest(`/api/books/${id}/unpublish`, 'PUT');
};

/**
 * Mengambil daftar semua kategori buku yang tersedia.
 * @returns {Promise<Array<string>>} - Array berisi nama-nama kategori.
 */
export const getBookCategories = async () => {
    const response = await apiRequest('/api/books/categories');
    return response.data || []; // Pastikan mengembalikan array
};

/**

 * Fungsi ini sama seperti di modul berita/event.
 * Mengirim file ke backend untuk mendapatkan signature dan URL Cloudinary.
 * @param {File} file - File gambar yang akan diupload.
 * @param {string} folder - Nama folder di Cloudinary (e.g., 'books').
 * @returns {Promise<object>} - Response dari backend berisi { url: '...' }.
 */
export const uploadCoverImage = (file, folder = 'books') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return apiRequest('/api/upload-signature', 'POST', formData, true);
};