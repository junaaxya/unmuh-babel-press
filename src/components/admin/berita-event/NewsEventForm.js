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
    faCloudUploadAlt,
} from '@fortawesome/free-solid-svg-icons';
import FormInput from '@/components/ui/FormInput/FormInput';
import TextArea from '@/components/ui/TextArea/Textarea';
import ImageUploader from '@/components/admin/berita-event/ImageUploader';
import Editor from '@/components/admin/berita-event/Editor';
import { uploadImage } from '../../../app/services/api';

// Definisikan state awal di luar komponen agar bisa digunakan kembali
const createInitialState = (type) => ({
    title: '',
    excerpt: '',
    image: '',
    date: '',
    time: '',
    location: '',
    category: type === 'berita' ? 'Berita' : 'Event',
    status: type === 'berita' ? 'draft' : 'Upcoming', // Status default
    publishStatus: 'draft',
    author: '',
    organizer: '',
    slug: '',
    content: '',
    registrationEnabled: false,
    registrationTitle: 'Tertarik mengikuti event ini?',
    registrationDescription: 'Daftarkan diri Anda sekarang juga!',
    registrationButtonText: 'Daftar Sekarang',
    registrationLink: '',
    registrationDeadline: '',
});

export default function NewsEventForm({
    type,
    initialData,
    onSubmit,
    onCancel,
}) {
    const [formData, setFormData] = useState(createInitialState(type));
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const currentPublishStatus = type === 'berita' ? formData.status : formData.publishStatus;

    const newsCategories = [
        { value: 'Berita', label: 'Berita' },
        { value: 'Pengumuman', label: 'Pengumuman' },
        { value: 'Artikel', label: 'Artikel' },
        { value: 'Press_Release', label: 'Press Release' },
    ];
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
            setFormData((prevState) => ({
                ...createInitialState(type),
                ...initialData,
                // Pastikan status publikasi di-set dengan benar dari data awal
                status:
                    type === 'berita'
                        ? initialData.status || 'draft'
                        : initialData.status || 'Upcoming',
                publishStatus: initialData.publishStatus || 'draft',
                date: initialData.date
                    ? new Date(initialData.date).toISOString().split('T')[0]
                    : '',
            }));
        } else {
            setFormData(createInitialState(type));
        }
    }, [initialData, type]);

    const generateSlug = (title) => {
        if (typeof title !== 'string') return '';
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
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const {
            title,
            excerpt,
            image,
            date,
            content,
            author,
            organizer,
            time,
            location,
            registrationEnabled,
            registrationLink,
            registrationTitle,
            registrationButtonText,
        } = formData;

        // Validasi yang lebih aman dengan memeriksa keberadaan nilai
        if (!title || !title.trim()) newErrors.title = 'Judul wajib diisi';
        if (title && title.length > 200)
            newErrors.title = 'Judul maksimal 200 karakter';

        if (!excerpt || !excerpt.trim())
            newErrors.excerpt = 'Ringkasan wajib diisi';
        if (excerpt && excerpt.length > 500)
            newErrors.excerpt = 'Ringkasan maksimal 500 karakter';

        if (!image) newErrors.image = 'Gambar wajib diupload';
        if (!date) newErrors.date = 'Tanggal wajib diisi';
        if (!content || !content.trim())
            newErrors.content = 'Konten wajib diisi';

        if (type === 'berita') {
            if (!author || !author.trim())
                newErrors.author = 'Penulis wajib diisi';
        } else {
            // Validasi untuk event
            if (!organizer || !organizer.trim())
                newErrors.organizer = 'Penyelenggara wajib diisi';
            if (!time || !time.trim()) newErrors.time = 'Waktu wajib diisi';
            if (!location || !location.trim())
                newErrors.location = 'Lokasi wajib diisi';

            if (registrationEnabled) {
                if (!registrationLink || !registrationLink.trim())
                    newErrors.registrationLink = 'Link registrasi wajib diisi';
                if (registrationLink && !isValidUrl(registrationLink))
                    newErrors.registrationLink = 'Format URL tidak valid';
                if (!registrationTitle || !registrationTitle.trim())
                    newErrors.registrationTitle =
                        'Judul registrasi wajib diisi';
                if (registrationTitle && registrationTitle.length > 100)
                    newErrors.registrationTitle =
                        'Judul registrasi maksimal 100 karakter';
                if (!registrationButtonText || !registrationButtonText.trim())
                    newErrors.registrationButtonText =
                        'Teks tombol wajib diisi';
            }
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

    const handleSubmit = async (e,publishStatus) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        // Cek apakah ini mode edit atau mode buat baru
        // *** PERBAIKAN: Pastikan slug unik saat membuat item baru ***
        const isEditing = !!initialData;
        let finalSlug = formData.slug || generateSlug(formData.title);

        if (!isEditing) {
            finalSlug = `${finalSlug}-${Date.now()}`;
        }

        // *** SOLUSI: Buat payload yang bersih sebelum dikirim ***
        const commonPayload = {
            title: formData.title,
            slug: finalSlug || generateSlug(formData.title),
            excerpt: formData.excerpt,
            content: formData.content,
            image: formData.image,
            date: formData.date,
            category: formData.category,
        };

         let payload;
        if (type === 'berita') {
            payload = {
                title: formData.title,
                slug: finalSlug,
                excerpt: formData.excerpt,
                content: formData.content,
                image: formData.image,
                date: formData.date,
                category: formData.category,
                author: formData.author,
                status: publishStatus, // Menggunakan parameter 'publishStatus'
            };
        } else { // type === 'event'
            payload = {
                title: formData.title,
                slug: finalSlug,
                excerpt: formData.excerpt,
                content: formData.content,
                image: formData.image,
                date: formData.date,
                time: formData.time,
                location: formData.location,
                category: formData.category,
                organizer: formData.organizer,
                registrationEnabled: formData.registrationEnabled,
                registrationTitle: formData.registrationTitle,
                registrationDescription: formData.registrationDescription,
                registrationButtonText: formData.registrationButtonText,
                registrationLink: formData.registrationLink,
                registrationDeadline: formData.registrationDeadline || null,
                status: formData.status, // Ini adalah status siklus hidup (Upcoming, dll)
                publishStatus: publishStatus, // Ini adalah status publikasi dari parameter
            };
        }

        try {
            // Kirim payload yang sudah bersih, bukan seluruh formData
            await onSubmit(payload);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = (imageUrl) => {
        handleInputChange('image', imageUrl);
    };

    const handleContentChange = (content, textLength) => {
        handleInputChange('content', content);
    };
    // *** FUNGSI BARU UNTUK UPLOAD GAMBAR DARI EDITOR ***
    const handleEditorImageUpload = async (file) => {
        // Tentukan folder berdasarkan tipe (berita atau event)
        // Masukan: Tambahkan subfolder 'content' untuk memisahkan gambar utama dan gambar konten
        const folder =
            type === 'berita'
                ? 'unmuh-babel/news/content'
                : 'unmuh-babel/events/content';

        try {
            // Panggil fungsi API yang sudah ada
            const response = await uploadImage(file, folder);
            // Kembalikan URL agar bisa digunakan oleh editor
            return response.url;
        } catch (error) {
            console.error('Gagal mengunggah gambar dari editor:', error);
            // Lemparkan kembali error agar komponen Editor bisa menampilkannya
            throw error;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <FormInput
                label="Judul"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder={`Masukkan judul ${
                    type === 'berita' ? 'berita' : 'event'
                }...`}
                error={errors.title}
                required
                icon={faFileText}
                maxLength={200}
            />

            {/* Slug */}
            <FormInput
                label="Slug"
                value={formData.slug || ''}
                onChange={() => {}}
                placeholder="slug-otomatis-dari-judul"
                readOnly
                icon={faTag}
                helpText="Slug akan otomatis dibuat dari judul"
            />

            {/* Excerpt */}
            <TextArea
                label="Ringkasan"
                value={formData.excerpt || ''}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
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
                    currentImage={formData.image || ''}
                    onUpload={handleImageUpload}
                    folder={
                        type === 'berita'
                            ? 'unmuh-babel/news'
                            : 'unmuh-babel/events'
                    }
                    error={errors.image}
                />
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Tanggal"
                    type="date"
                    value={formData.date || ''}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    error={errors.date}
                    required
                    icon={faCalendarAlt}
                />
                {type === 'event' && (
                    <FormInput
                        label="Waktu"
                        value={formData.time || ''}
                        onChange={(e) => handleInputChange('time', e.target.value)}
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
                        {type === 'berita'
                            ? newsCategories.map((category) => (
                                  <option
                                      key={category.value}
                                      value={category.value}
                                  >
                                      {category.label}
                                  </option>
                              ))
                            : eventCategories.map((category) => (
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
                        onChange={(e) => handleInputChange('author', e.target.value)}
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
                        onChange={(e) =>
                            handleInputChange('organizer', e.target.value)
                        }
                        placeholder="Nama penyelenggara event"
                        error={errors.organizer}
                        required
                        icon={faUser}
                    />

                    <FormInput
                        label="Lokasi"
                        value={formData.location}
                        onChange={(e) =>
                            handleInputChange('location', e.target.value)
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
                                <FontAwesomeIcon
                                    icon={faTicketAlt}
                                    className="mr-2 text-blue-600"
                                />
                                Pengaturan Registrasi
                            </h3>
                            <button
                                type="button"
                                onClick={() =>
                                    handleInputChange(
                                        'registrationEnabled',
                                        !formData.registrationEnabled
                                    )
                                }
                                className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    formData.registrationEnabled
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={
                                        formData.registrationEnabled
                                            ? faToggleOn
                                            : faToggleOff
                                    }
                                    className="mr-1"
                                />
                                {formData.registrationEnabled
                                    ? 'Aktif'
                                    : 'Nonaktif'}
                            </button>
                        </div>

                        {formData.registrationEnabled && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput
                                        label="Judul Registrasi"
                                        value={formData.registrationTitle}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'registrationTitle',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Tertarik mengikuti event ini?"
                                        error={errors.registrationTitle}
                                        required
                                        maxLength={100}
                                    />

                                    <FormInput
                                        label="Teks Tombol"
                                        value={formData.registrationButtonText}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'registrationButtonText',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Daftar Sekarang"
                                        error={errors.registrationButtonText}
                                        required
                                        maxLength={50}
                                    />
                                </div>

                                <TextArea
                                    label="Deskripsi Registrasi"
                                    value={formData.registrationDescription}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'registrationDescription',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Daftarkan diri Anda sekarang juga!"
                                    error={errors.registrationDescription}
                                    rows={2}
                                    maxLength={200}
                                />

                                <FormInput
                                    label="Link Registrasi"
                                    value={formData.registrationLink}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'registrationLink',
                                            e.target.value
                                        )
                                    }
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
                                    onChange={(e) =>
                                        handleInputChange(
                                            'registrationDeadline',
                                            e.target.value
                                        )
                                    }
                                    error={errors.registrationDeadline}
                                    icon={faCalendarAlt}
                                    helpText="Opsional - Batas waktu pendaftaran"
                                />

                                {/* Preview */}
                                <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        Preview:
                                    </h4>
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-blue-50 rounded-lg">
                                        <div>
                                            <h5 className="font-semibold text-gray-900">
                                                {formData.registrationTitle}
                                            </h5>
                                            <p className="text-gray-600">
                                                {
                                                    formData.registrationDescription
                                                }
                                            </p>
                                            {formData.registrationDeadline && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    Batas pendaftaran:{' '}
                                                    {new Date(
                                                        formData.registrationDeadline
                                                    ).toLocaleString('id-ID')}
                                                </p>
                                            )}
                                        </div>
                                        <div className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center">
                                            <FontAwesomeIcon
                                                icon={faTicketAlt}
                                                className="mr-2"
                                            />
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
                        content={formData.content || ''}
                        onChange={handleContentChange}
                        placeholder={`Tulis konten lengkap ${
                            type === 'berita' ? 'berita' : 'event'
                        } di sini...`}
                        onImageUpload={handleEditorImageUpload}
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
                    type="button"
                    onClick={(e) => handleSubmit(e, 'draft')}
                    disabled={isSubmitting || currentPublishStatus === 'draft'}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FontAwesomeIcon
                        icon={faSave}
                        className={`mr-2 ${isSubmitting ? 'animate-spin' : ''}`}
                    />
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Draf'}
                </button>
                <button
                    type="button"
                    onClick={(e) => handleSubmit(e, 'published')}
                    disabled={isSubmitting || currentPublishStatus === 'published'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FontAwesomeIcon
                        icon={faCloudUploadAlt}
                        className={`mr-2 ${isSubmitting ? 'animate-spin' : ''}`}
                    />
                    {isSubmitting ? 'Memproses...' : 'Publikasikan'}
                    
                </button>
            </div>
        </form>
    );
}
