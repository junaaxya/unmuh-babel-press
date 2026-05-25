// src/components/admin/dashboard/BookForm/BookForm.js
import { useState, useEffect, useCallback } from 'react';
import FormInput from '@/components/ui/FormInput/FormInput';
import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBook,
    faUser,
    faBuilding,
    faUserEdit,
    faRuler,
    faFileText,
    faImage,
    faSave,
    faTimes,
    faBarcode,
    faCalendarAlt,
    faCircleNotch,
    faCheckCircle,
    faLink,
    faExternalLinkAlt,
    faTimesCircle,
    faFilePdf,
} from '@fortawesome/free-solid-svg-icons';

import {
    uploadCoverImage,
    getBookCategories,
} from '../../../../app/services/api';

const BookForm = ({
    book,
    onSubmit,
    onCancel,
    isLoading = false,
    apiErrors = {},
    showNotification,
}) => {
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch (e) {
            return '';
        }
    };

    const [formData, setFormData] = useState({
        kode_buku: '',
        title: '',
        isbn: '',
        penerbit: '',
        editor: '',
        ukuran: '',
        penulis: '',
        halaman: '',
        sinopsis: '',
        kategori: '',
        image: '',
        status: 'draft',
        published_at: '',
        google_books_url: '',
        pdf_url: '',
        preview_percent: 100,
    });

    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [isUploadingPdf, setIsUploadingPdf] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getBookCategories();
                setCategories(
                    fetchedCategories.map((cat) => ({ value: cat, label: cat }))
                );
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (book) {
            setFormData({
                kode_buku: book.kode_buku || '',
                title: book.title || '',
                isbn: book.isbn || '',
                penerbit: book.penerbit || '',
                editor: book.editor || '',
                ukuran: book.ukuran || '',
                penulis: book.penulis || '',
                halaman: book.halaman || '',
                sinopsis: book.sinopsis || '',
                kategori: book.kategori || '',
                image: book.image || '',
                status: book.status || 'draft',
                published_at: formatDateForInput(book.published_at),
                google_books_url: book.google_books_url || '',
                pdf_url: book.pdf_url || '',
                preview_percent: book.preview_percent || 100,
            });

            if (book.image) {
                setPreviewImage(book.image);
            }
        }
    }, [book]);

    const combinedErrors = { ...errors, ...apiErrors };

    const handleInputChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));

            if (errors[name] || apiErrors[name]) {
                setErrors((prev) => ({ ...prev, [name]: undefined }));
            }
        },
        [errors, apiErrors]
    );

    const handleClearGoogleBooksUrl = () => {
        setFormData((prev) => ({ ...prev, google_books_url: '' }));
    };

    const handleClearPdf = () => {
        setFormData((prev) => ({ ...prev, pdf_url: '' }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, image: 'Ukuran file maksimal 5MB.' }));
            return;
        }

        setIsUploading(true);
        showNotification?.('info', 'Mengunggah cover buku...');
        setErrors((prev) => ({ ...prev, image: undefined }));

        const localPreview = URL.createObjectURL(file);
        setPreviewImage(localPreview);

        try {
            const response = await uploadCoverImage(file, 'books');
            setFormData((prev) => ({ ...prev, image: response.url }));
            setPreviewImage(response.url);
            showNotification?.('success', 'Cover buku berhasil diunggah!');
        } catch (error) {
            console.error('Image upload failed:', error);
            setErrors((prev) => ({
                ...prev,
                image: error.message || 'Gagal mengunggah gambar.',
            }));
            setPreviewImage(book?.image || null);
        } finally {
            setIsUploading(false);
        }
    };

    const handlePdfChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setErrors((prev) => ({ ...prev, pdf_url: 'File harus berformat PDF.' }));
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, pdf_url: 'Ukuran PDF maksimal 50MB.' }));
            return;
        }

        setIsUploadingPdf(true);
        showNotification?.('info', 'Mengunggah PDF buku...');
        setErrors((prev) => ({ ...prev, pdf_url: undefined }));

        try {
            const response = await uploadCoverImage(file, 'books-pdf');

            setFormData((prev) => ({
                ...prev,
                pdf_url: response.url,
            }));

            showNotification?.('success', 'PDF buku berhasil diunggah!');
        } catch (error) {
            console.error('PDF upload failed:', error);
            setErrors((prev) => ({
                ...prev,
                pdf_url: error.message || 'Gagal mengunggah PDF.',
            }));
        } finally {
            setIsUploadingPdf(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Judul buku wajib diisi';
        if (!formData.penerbit.trim()) newErrors.penerbit = 'Penerbit wajib diisi';
        if (!formData.penulis.trim()) newErrors.penulis = 'Penulis wajib diisi';
        if (!String(formData.halaman || '').trim()) newErrors.halaman = 'Jumlah halaman wajib diisi';
        if (!formData.kategori) newErrors.kategori = 'Kategori wajib dipilih';
        if (!formData.sinopsis.trim()) newErrors.sinopsis = 'Sinopsis wajib diisi';

        if (formData.google_books_url.trim()) {
            try {
                new URL(formData.google_books_url.trim());
            } catch {
                newErrors.google_books_url = 'URL tidak valid. Contoh: https://books.google.com/books?id=...';
            }
        }

        const percent = Number(formData.preview_percent);
        if (percent < 10 || percent > 100) {
            newErrors.preview_percent = 'Batas baca harus antara 10% sampai 100%.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e, status) => {
        e.preventDefault();
        if (!validateForm()) return;

        const submissionData = new FormData();

        for (const key in formData) {
            if (key === 'published_at' && formData[key]) {
                submissionData.append(key, new Date(formData[key]).toISOString());
            } else if (formData[key] !== null && formData[key] !== undefined) {
                if (key !== 'status') submissionData.append(key, formData[key]);
            }
        }

        submissionData.append('status', status);
        onSubmit(submissionData);
    };

    const hasGoogleBooksUrl = formData.google_books_url.trim() !== '';
    const hasPdf = formData.pdf_url.trim() !== '';

    return (
        <form onSubmit={(e) => handleSubmit(e, 'published')} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <FormInput
                        label="Kode Buku"
                        name="kode_buku"
                        value={formData.kode_buku}
                        onChange={handleInputChange}
                        placeholder="Masukkan Kode buku"
                        required
                        error={errors.kode_buku}
                        icon={faBarcode}
                    />

                    <FormInput
                        label="Judul Buku"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Masukkan judul buku"
                        required
                        error={errors.title}
                        icon={faBook}
                    />

                    <FormInput
                        label="ISBN"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleInputChange}
                        placeholder="978-xxx-xxx-xxx-x"
                        error={errors.isbn}
                        icon={faBarcode}
                    />

                    <FormInput
                        label="Penerbit"
                        name="penerbit"
                        value={formData.penerbit}
                        onChange={handleInputChange}
                        placeholder="Nama penerbit"
                        required
                        error={errors.penerbit}
                        icon={faBuilding}
                    />

                    <FormInput
                        label="Editor"
                        name="editor"
                        value={formData.editor}
                        onChange={handleInputChange}
                        placeholder="Nama editor"
                        icon={faUserEdit}
                    />

                    <FormInput
                        label="Ukuran Buku"
                        name="ukuran"
                        value={formData.ukuran}
                        onChange={handleInputChange}
                        placeholder="Contoh: 14 x 20 cm"
                        icon={faRuler}
                    />
                </div>

                <div className="space-y-4">
                    <FormInput
                        label="Penulis"
                        name="penulis"
                        value={formData.penulis}
                        onChange={handleInputChange}
                        placeholder="Nama penulis"
                        required
                        error={errors.penulis}
                        icon={faUser}
                    />

                    <FormInput
                        label="Jumlah Halaman"
                        name="halaman"
                        type="number"
                        value={formData.halaman}
                        onChange={handleInputChange}
                        placeholder="Jumlah halaman"
                        required
                        error={errors.halaman}
                        min="1"
                    />

                    <FormInput
                        label="Kategori"
                        name="kategori"
                        type="select"
                        value={formData.kategori}
                        onChange={handleInputChange}
                        required
                        error={errors.kategori}
                        options={categories}
                    />

                    <FormInput
                        label="Tanggal Terbit"
                        name="published_at"
                        type="date"
                        value={formData.published_at}
                        onChange={handleInputChange}
                        error={combinedErrors.published_at}
                        icon={faCalendarAlt}
                    />

                    <FormInput
                        label="Cover Buku"
                        name="cover"
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        icon={faImage}
                    />

                    {previewImage && (
                        <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                Preview Cover:
                            </p>
                            <div className="relative w-32 h-40 bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                    src={previewImage}
                                    alt="Preview"
                                    width={200}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <FormInput
                label="Sinopsis"
                name="sinopsis"
                type="textarea"
                value={formData.sinopsis}
                onChange={handleInputChange}
                placeholder="Tulis sinopsis buku..."
                required
                error={errors.sinopsis}
                rows={4}
                icon={faFileText}
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FontAwesomeIcon icon={faLink} className="mr-2 text-blue-500" />
                    Link Google Books
                </label>

                <div className="flex gap-2 items-center">
                    <input
                        type="url"
                        name="google_books_url"
                        value={formData.google_books_url}
                        onChange={handleInputChange}
                        placeholder="https://books.google.com/books?id=..."
                        className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.google_books_url ? 'border-red-400' : 'border-gray-300'
                        }`}
                    />

                    {hasGoogleBooksUrl && (
                        <a
                            href={formData.google_books_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Buka di Google Books"
                            className="flex items-center justify-center w-9 h-9 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                            <FontAwesomeIcon icon={faExternalLinkAlt} className="w-4 h-4" />
                        </a>
                    )}

                    {hasGoogleBooksUrl && (
                        <button
                            type="button"
                            onClick={handleClearGoogleBooksUrl}
                            title="Hapus link Google Books"
                            className="flex items-center justify-center w-9 h-9 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                            <FontAwesomeIcon icon={faTimesCircle} className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {errors.google_books_url && (
                    <p className="text-red-500 text-xs mt-1">{errors.google_books_url}</p>
                )}
            </div>

            {/* PDF Buku */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faFilePdf} className="mr-2 text-red-500" />
                    File PDF Buku
                </label>

                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfChange}
                    disabled={isUploadingPdf}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-red-700"
                />

                {isUploadingPdf && (
                    <p className="text-blue-600 text-xs mt-2">
                        Mengunggah PDF...
                    </p>
                )}

                {errors.pdf_url && (
                    <p className="text-red-500 text-xs mt-2">{errors.pdf_url}</p>
                )}

                {hasPdf ? (
                    <div className="mt-3 flex items-center gap-2">
                        <a
                            href={formData.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700 hover:bg-green-200"
                        >
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                            Lihat PDF
                        </a>

                        <button
                            type="button"
                            onClick={handleClearPdf}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-600 hover:bg-red-200"
                        >
                            <FontAwesomeIcon icon={faTimesCircle} />
                            Hapus PDF
                        </button>
                    </div>
                ) : (
                    <p className="text-gray-500 text-xs mt-2">
                        Belum ada PDF buku yang diunggah.
                    </p>
                )}
            </div>

            {/* Batas Baca */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batas Baca Pengunjung
                </label>

                <select
                    name="preview_percent"
                    value={formData.preview_percent}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.preview_percent ? 'border-red-400' : 'border-gray-300'
                    }`}
                >
                    {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((percent) => (
                        <option key={percent} value={percent}>
                            Pengunjung bisa baca {percent}%
                        </option>
                    ))}
                </select>

                {errors.preview_percent && (
                    <p className="text-red-500 text-xs mt-2">{errors.preview_percent}</p>
                )}

                <p className="text-gray-500 text-xs mt-2">
                    Contoh: jika buku 100 halaman dan dipilih 30%, maka pengunjung hanya boleh membaca 30 halaman.
                </p>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                >
                    <FontAwesomeIcon icon={faTimes} className="mr-2" />
                    Batal
                </button>

                <button
                    type="button"
                    onClick={(e) => handleSubmit(e, 'draft')}
                    disabled={isLoading || isUploading || isUploadingPdf || (book && book.status === 'draft')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                    <FontAwesomeIcon
                        icon={isLoading ? faCircleNotch : faSave}
                        className={`mr-2 ${isLoading ? 'animate-spin' : ''}`}
                    />
                    Simpan Draf
                </button>

                <button
                    type="submit"
                    disabled={isLoading || isUploading || isUploadingPdf}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    {isLoading ? 'Menyimpan...' : 'Simpan Buku'}
                </button>
            </div>
        </form>
    );
};

export default BookForm;