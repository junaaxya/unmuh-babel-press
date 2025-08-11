// src/components/admin/BookForm/BookForm.js
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
} from '@fortawesome/free-solid-svg-icons';
import {
    uploadCoverImage,
    getBookCategories,
} from '../../../../../app/services/api.books';

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
    });
    const [imageFile, setImageFile] = useState(null);

    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // Untuk masa depan jika ingin progress bar
    const [previewImage, setPreviewImage] = useState(null);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getBookCategories();
                setCategories(
                    fetchedCategories.map((cat) => ({ value: cat, label: cat }))
                );
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                // Mungkin bisa ditambahkan notifikasi toast di sini
            }
        };
        fetchCategories();
    }, []);

    // Populate form if editing an existing book
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
            });
            if (book.image) {
                setPreviewImage(book.image);
            }
        }
    }, [book]);

    // Gabungkan error dari client-side dan server-side
    const combinedErrors = { ...errors, ...apiErrors };

    const handleInputChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
            // Clear error when user starts typing
            if (errors[name] || apiErrors[name]) {
                setErrors((prev) => ({ ...prev, [name]: undefined }));
            }
        },
        [errors, apiErrors]
    );

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);

        // Validasi file di client-side
        if (file.size > 5 * 1024 * 1024) {
            // 5MB
            setErrors((prev) => ({
                ...prev,
                image: 'Ukuran file maksimal 5MB.',
            }));
            return;
        }

        setIsUploading(true);
        showNotification('info', 'Mengunggah cover buku...');
        setErrors((prev) => ({ ...prev, image: undefined }));

        // Buat preview lokal sementara
        const localPreview = URL.createObjectURL(file);
        setPreviewImage(localPreview);

        try {
            // Panggil API untuk upload ke Cloudinary via backend
            const response = await uploadCoverImage(file, 'books');
            setFormData((prev) => ({ ...prev, image: response.url }));
            setPreviewImage(response.url); // Update preview dengan URL final
            showNotification('success', 'Cover buku berhasil diunggah!');
        } catch (error) {
            console.error('Image upload failed:', error);
            setErrors((prev) => ({
                ...prev,
                image: error.message || 'Gagal mengunggah gambar.',
            }));
            setPreviewImage(book?.image || null); // Kembalikan ke gambar awal jika gagal
        } finally {
            setIsUploading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.kode_buku.trim())
            newErrors.kode_buku = 'Kode buku wajib diisi';
        if (!formData.title.trim()) newErrors.title = 'Judul buku wajib diisi';
        if (!formData.penerbit.trim())
            newErrors.penerbit = 'Penerbit wajib diisi';
        if (!formData.penulis.trim()) newErrors.penulis = 'Penulis wajib diisi';
        if (!String(formData.halaman || '').trim()) {
            newErrors.halaman = 'Jumlah halaman wajib diisi';
        }
        if (!formData.kategori) newErrors.kategori = 'Kategori wajib dipilih';
        if (!formData.sinopsis.trim())
            newErrors.sinopsis = 'Sinopsis wajib diisi';

       

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
  const handleSubmit = (e, status) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const submissionData = new FormData();
        for (const key in formData) {
            if (key === 'published_at' && formData[key]) {
                submissionData.append(key, new Date(formData[key]).toISOString());
            } else if (formData[key] !== null && formData[key] !== undefined) {
                // Jangan kirim status dari state, karena kita pakai dari parameter
                if (key !== 'status') {
                    submissionData.append(key, formData[key]);
                }
            }
        }
        
        // Gunakan 'status' dari parameter tombol yang diklik
        submissionData.append('status', status);

        onSubmit(submissionData);
    };


    return (
          <form onSubmit={(e) => handleSubmit(e, 'published')} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
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

                {/* Right Column */}
                <div className="space-y-4">
                    <FormInput
                        label="Penulis"
                        name="penulis"
                        value={formData.penulis}
                        onChange={handleInputChange}
                        placeholder="Nama penulis"
                        required
                        error={errors.author}
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

                    {/* Cover Image Upload */}
                    <FormInput
                        label="Cover Buku"
                        name="cover"
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        icon={faImage}
                    />

                    {/* Image Preview */}
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

            {/* Synopsis - Full Width */}
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

            {/* Action Buttons */}
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
                    // Panggil handleSubmit dengan status 'draft'
                    onClick={(e) => handleSubmit(e, 'draft')}
                    disabled={isLoading || (book && book.status === 'draft')}
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
                    disabled={isLoading}
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
