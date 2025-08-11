// src/app/services/api.events.js
import { apiRequest } from './api';

// Ambil event berdasarkan slug
export const getEventBySlug = async (slug) => {
    return apiRequest(`/api/events/slug/${slug}`);
};

// Ambil daftar event dengan query params
export const getEvents = async (params) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/events?${query}`);
};

// Buat event baru
export const createEvent = async (data) => {
    return apiRequest('/api/events', 'POST', data);
};

// Perbarui event
export const updateEvent = async (id, data) => {
    return apiRequest(`/api/events/${id}`, 'PUT', data);
};

// Hapus event
export const deleteEvent = async (id) => {
    return apiRequest(`/api/events/${id}`, 'DELETE');
};

// Publish event
export const setEventPublished = async (id) => {
    return apiRequest(`/api/events/${id}/publish`, 'PUT');
};

// Unpublish event
export const setEventUnpublished = async (id) => {
    return apiRequest(`/api/events/${id}/unpublish`, 'PUT');
};

