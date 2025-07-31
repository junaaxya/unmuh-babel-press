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
    faLink,
    faTicketAlt,
    faToggleOn,
    faToggleOff,
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
        // Registration fields for events
        registrationEnabled: false,
        registrationTitle: 'Tertarik mengikuti event ini?',
        registrationDescription: 'Daftarkan diri Anda sekarang juga!',
        registrationButtonText: 'Daftar Sekarang',
        registrationLink: '',
        registrationDeadline: '',
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

            // Registration validation for events
            if (formData.registrationEnabled) {
                if (!formData.registrationLink.trim()) {
                    newErrors.registrationLink = 'Link registrasi wajib diisi jika registrasi diaktifkan';
                }
                
                // Validate URL format
                if (formData.registrationLink && !isValidUrl(formData.registrationLink)) {
                    newErrors.registrationLink = 'Format URL tidak valid';
                }

                if (!formData.registrationTitle.trim()) {
                    newErrors.registrationTitle = 'Judul registrasi wajib diisi';
                }

                if (!formData.registrationButtonText.trim()) {
                    newErrors.registrationButtonText = 'Teks tombol wajib diisi';
                }
            }
        }

        // Length validation
        if (formData.title.length > 200) {
            newErrors.title = 'Judul maksimal 200 karakter';
        }

        if (formData.excerpt.length > 500) {
            newErrors.excerpt = 'Ringkasan maksimal 500 karakter';
        }

        if (formData.registrationTitle.length > 100) {
            newErrors.registrationTitle = 'Judul registrasi maksimal 100 karakter';
        }

        if (formData.registrationDescription.length > 200) {
            newErrors.registrationDescription = 'Deskripsi registrasi maksimal 200 karakter';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
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

                    {/* Registration Section */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-blue-50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <FontAwesomeIcon icon={faTicketAlt} className="mr-2 text-blue-600" />
                                Pengaturan Registrasi
                            </h3>
                            <button
                                type="button"
                                onClick={() => handleInputChange('registrationEnabled', !formData.registrationEnabled)}
                                className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    formData.registrationEnabled
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                <FontAwesomeIcon 
                                    icon={formData.registrationEnabled ? faToggleOn : faToggleOff} 
                                    className="mr-1" 
                                />
                                {formData.registrationEnabled ? 'Aktif' : 'Nonaktif'}
                            </button>
                        </div>

                        {formData.registrationEnabled && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput
                                        label="Judul Registrasi"
                                        value={formData.registrationTitle}
                                        onChange={(value) => handleInputChange('registrationTitle', value)}
                                        placeholder="Tertarik mengikuti event ini?"
                                        error={errors.registrationTitle}
                                        required
                                        maxLength={100}
                                    />

                                    <FormInput
                                        label="Teks Tombol"
                                        value={formData.registrationButtonText}
                                        onChange={(value) => handleInputChange('registrationButtonText', value)}
                                        placeholder="Daftar Sekarang"
                                        error={errors.registrationButtonText}
                                        required
                                        maxLength={50}
                                    />
                                </div>

                                <TextArea
                                    label="Deskripsi Registrasi"
                                    value={formData.registrationDescription}
                                    onChange={(value) => handleInputChange('registrationDescription', value)}
                                    placeholder="Daftarkan diri Anda sekarang juga!"
                                    error={errors.registrationDescription}
                                    rows={2}
                                    maxLength={200}
                                />

                                <FormInput
                                    label="Link Registrasi"
                                    value={formData.registrationLink}
                                    onChange={(value) => handleInputChange('registrationLink', value)}
                                    placeholder="https://example.com/register"
                                    error={errors.registrationLink}
                                    required
                                    icon={faLink}
                                    helpText="Masukkan URL lengkap untuk link registrasi"
                                />

                                <FormInput
                                    label="Batas Waktu Registrasi"
                                    type="datetime-local"
                                    value={formData.registrationDeadline}
                                    onChange={(value) => handleInputChange('registrationDeadline', value)}
                                    error={errors.registrationDeadline}
                                    icon={faCalendarAlt}
                                    helpText="Opsional - Batas waktu pendaftaran"
                                />

                                {/* Preview */}
                                <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-blue-50 rounded-lg">
                                        <div>
                                            <h5 className="font-semibold text-gray-900">{formData.registrationTitle}</h5>
                                            <p className="text-gray-600">{formData.registrationDescription}</p>
                                            {formData.registrationDeadline && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    Batas pendaftaran: {new Date(formData.registrationDeadline).toLocaleString('id-ID')}
                                                </p>
                                            )}
                                        </div>
                                        <div className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center">
                                            <FontAwesomeIcon icon={faTicketAlt} className="mr-2" />
                                            {formData.registrationButtonText}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
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