// src/app/services/api.js

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Fungsi request umum dengan penanganan error terstruktur
export async function apiRequest(url, method = 'GET', body = null, isFormData = false) {
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
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return res.json();
            }
            return { status: 'success', message: 'Operation successful' };
        }

        const errorText = await res.text();
        throw new Error(errorText);
    } catch (error) {
        try {
            const errorBody = JSON.parse(error.message);
            if (errorBody && errorBody.errors && errorBody.errors.fieldErrors) {
                throw errorBody.errors.fieldErrors;
            }
        } catch (e) {
            // abaikan jika bukan JSON
        }

        throw error;
    }
}

// Utilitas upload gambar ke backend untuk mendapatkan URL Cloudinary
export const uploadImage = async (file, folder) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return apiRequest('/api/upload-signature', 'POST', formData, true);
};

