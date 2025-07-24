// src/components/admin/berita-event/NewsEventForm.js
'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSave,
    faTimes,
    faImage,
    faCalendarAlt,
    faMapMarkerAlt,
    faUser,
    faTag,
    faFileText,
} from '@fortawesome/free-solid-svg-icons';
import FormInput from '@/components/ui/FormInput/FormInput';
import TextArea from '@/components/ui/TextArea/Textarea';
import ImageUploader from '@/components/admin/berita-event/ImageUploader';
import Editor from '@/components/admin/berita-event/Editor';

export default function NewsEventForm({
    type,
    initialData,
    onSubmit,
    onCancel,
}) {
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        image: '',
        date: '',
        time: '', // for events
        location: '', // for events
        category: type === 'berita' ? 'Berita' : 'Event',
        status: 'Upcoming', // for events
        author: '', // for news
        organizer: '', // for events
        slug: '',
        content: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Categories
    const newsCategories = ['Berita', 'Pengumuman', 'Artikel', 'Press Release'];
    const eventCategories = [
        'Event',
        'Seminar',
        'Workshop',
        'Konferensi',
        'Pelatihan',
    ];
    const eventStatuses = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData });
        }
    }, [initialData]);

    // Generate slug from title
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
            ...(field === 'title' && { slug: generateSlug(value) }),
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields validation
        if (!formData.title.trim()) {
            newErrors.title = 'Judul wajib diisi';
        }

        if (!formData.excerpt.trim()) {
            newErrors.excerpt = 'Ringkasan wajib diisi';
        }

        if (!formData.image) {
            newErrors.image = 'Gambar wajib diupload';
        }

        if (!formData.date) {
            newErrors.date = 'Tanggal wajib diisi';
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Konten wajib diisi';
        }

        // Type-specific validation
        if (type === 'berita') {
            if (!formData.author.trim()) {
                newErrors.author = 'Penulis wajib diisi';
            }
        } else {
            if (!formData.organizer.trim()) {
                newErrors.organizer = 'Penyelenggara wajib diisi';
            }
            if (!formData.time.trim()) {
                newErrors.time = 'Waktu wajib diisi';
            }
            if (!formData.location.trim()) {
                newErrors.location = 'Lokasi wajib diisi';
            }
        }

        // Length validation
        if (formData.title.length > 200) {
            newErrors.title = 'Judul maksimal 200 karakter';
        }

        if (formData.excerpt.length > 500) {
            newErrors.excerpt = 'Ringkasan maksimal 500 karakter';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            onSubmit(formData);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = (imageUrl) => {
        handleInputChange('image', imageUrl);
    };

    const handleContentChange = (content) => {
        handleInputChange('content', content);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <FormInput
                label="Judul"
                value={formData.title}
                onChange={(value) => handleInputChange('title', value)}
                placeholder={`Masukkan judul ${
                    type === 'berita' ? 'berita' : 'event'
                }...`}
                error={errors.title}
                required
                icon={faFileText}
                maxLength={200}
            />

            {/* Slug - Auto generated, readonly */}
            <FormInput
                label="Slug"
                value={formData.slug}
                onChange={() => {}} // Read only
                placeholder="slug-otomatis-dari-judul"
                readOnly
                icon={faTag}
                helpText="Slug akan otomatis dibuat dari judul"
            />

            {/* Excerpt */}
            <TextArea
                label="Ringkasan"
                value={formData.excerpt}
                onChange={(value) => handleInputChange('excerpt', value)}
                placeholder={`Ringkasan singkat ${
                    type === 'berita' ? 'berita' : 'event'
                } ini...`}
                error={errors.excerpt}
                required
                rows={3}
                maxLength={500}
            />

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faImage} className="mr-2" />
                    Gambar <span className="text-red-500">*</span>
                </label>
                <ImageUploader
                    currentImage={formData.image}
                    onUpload={handleImageUpload}
                    error={errors.image}
                />
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Tanggal"
                    type="date"
                    value={formData.date}
                    onChange={(value) => handleInputChange('date', value)}
                    error={errors.date}
                    required
                    icon={faCalendarAlt}
                />

                {type === 'event' && (
                    <FormInput
                        label="Waktu"
                        value={formData.time}
                        onChange={(value) => handleInputChange('time', value)}
                        placeholder="08:00 - 10:30 WIB"
                        error={errors.time}
                        required
                        icon={faCalendarAlt}
                    />
                )}
            </div>

            {/* Category and Status/Author Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon icon={faTag} className="mr-2" />
                        Kategori
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) =>
                            handleInputChange('category', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                        {(type === 'berita'
                            ? newsCategories
                            : eventCategories
                        ).map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {type === 'event' ? (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status Event
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) =>
                                handleInputChange('status', e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                            {eventStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status === 'Upcoming'
                                        ? 'Akan Datang'
                                        : status === 'Ongoing'
                                        ? 'Berlangsung'
                                        : status === 'Completed'
                                        ? 'Selesai'
                                        : 'Dibatalkan'}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <FormInput
                        label="Penulis"
                        value={formData.author}
                        onChange={(value) => handleInputChange('author', value)}
                        placeholder="Nama penulis berita"
                        error={errors.author}
                        required
                        icon={faUser}
                    />
                )}
            </div>

            {/* Event specific fields */}
            {type === 'event' && (
                <>
                    <FormInput
                        label="Penyelenggara"
                        value={formData.organizer}
                        onChange={(value) =>
                            handleInputChange('organizer', value)
                        }
                        placeholder="Nama penyelenggara event"
                        error={errors.organizer}
                        required
                        icon={faUser}
                    />

                    <FormInput
                        label="Lokasi"
                        value={formData.location}
                        onChange={(value) =>
                            handleInputChange('location', value)
                        }
                        placeholder="Lokasi pelaksanaan event"
                        error={errors.location}
                        required
                        icon={faMapMarkerAlt}
                    />
                </>
            )}

            {/* Content Editor */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faFileText} className="mr-2" />
                    Konten <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <Editor
                        content={formData.content}
                        onChange={handleContentChange}
                        placeholder={`Tulis konten lengkap ${
                            type === 'berita' ? 'berita' : 'event'
                        } di sini...`}
                    />
                </div>
                {errors.content && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.content}
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                    disabled={isSubmitting}
                >
                    <FontAwesomeIcon icon={faTimes} className="mr-2" />
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FontAwesomeIcon
                        icon={faSave}
                        className={`mr-2 ${isSubmitting ? 'animate-spin' : ''}`}
                    />
                    {isSubmitting
                        ? 'Menyimpan...'
                        : initialData
                        ? 'Perbarui'
                        : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
