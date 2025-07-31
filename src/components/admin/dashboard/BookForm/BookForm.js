// src/components/admin/BookForm/BookForm.js
import { useState, useEffect } from 'react';
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
    faBarcode
} from '@fortawesome/free-solid-svg-icons';

const BookForm = ({ book, onSubmit, onCancel, isLoading = false }) => {
    const [formData, setFormData] = useState({
        id: '',
        Kode_Buku: '',
        title: '',
        isbn: '',
        publisher: '',
        editor: '',
        size: '',
        author: '',
        pages: '',
        synopsis: '',
        category: '',
        cover: null,
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});

    const categories = [
        { value: '', label: 'Pilih Kategori' },
        { value: 'Pendidikan', label: 'Pendidikan' },
        { value: 'Agama', label: 'Agama' },
        { value: 'Teknologi', label: 'Teknologi' },
        { value: 'Sejarah', label: 'Sejarah' },
        { value: 'Sastra', label: 'Sastra' },
        { value: 'Sains', label: 'Sains' },
        { value: 'Ekonomi', label: 'Ekonomi' },
        { value: 'Politik', label: 'Politik' },
        { value: 'Budaya', label: 'Budaya' },
        { value: 'Lainnya', label: 'Lainnya' },
    ];

    useEffect(() => {
        if (book) {
            setFormData({
                id: book.id || '',
                Kode_Buku: book.Kode_Buku || '',
                title: book.title || '',
                isbn: book.ISBN || '',
                publisher: book.Penerbit || '',
                editor: book.Editor || '',
                size: book.Ukuran || '',
                author: book.Penulis || '',
                pages: book.Halaman || '',
                synopsis: book.sinopsis || '',
                category: book.Kategori || '',
                cover: null,
            });
            setPreviewImage(book.cover || null);
        }
    }, [book]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'cover' && files && files[0]) {
            const file = files[0];
            setFormData((prev) => ({ ...prev, cover: file }));

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => setPreviewImage(e.target.result);
            reader.readAsDataURL(file);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.Kode_Buku.trim()) newErrors.Kode_Buku = 'Kode buku wajib diisi';
        if (!formData.title.trim()) newErrors.title = 'Judul buku wajib diisi';
        if (!formData.isbn.trim()) newErrors.isbn = 'ISBN wajib diisi';
        if (!formData.publisher.trim())
            newErrors.publisher = 'Penerbit wajib diisi';
        if (!formData.author.trim()) newErrors.author = 'Penulis wajib diisi';
        if (!formData.pages.trim())
            newErrors.pages = 'Jumlah halaman wajib diisi';
        if (!formData.category) newErrors.category = 'Kategori wajib dipilih';
        if (!formData.synopsis.trim())
            newErrors.synopsis = 'Sinopsis wajib diisi';

        // Validate pages is a number
        if (formData.pages && isNaN(formData.pages)) {
            newErrors.pages = 'Jumlah halaman harus berupa angka';
        }

        // Validate ISBN format (basic)
        if (
            formData.isbn &&
            !/^[\d-]{10,17}$/.test(formData.isbn.replace(/\s/g, ''))
        ) {
            newErrors.isbn = 'Format ISBN tidak valid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                    <FormInput
                        label="Kode Buku"
                        name="kode buku"
                        value={formData.Kode_Buku}
                        onChange={handleInputChange}
                        placeholder="Masukkan Kode buku"
                        required
                        error={errors.Kode_Buku}
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
                        required
                        error={errors.isbn}
                    />

                    <FormInput
                        label="Penerbit"
                        name="publisher"
                        value={formData.publisher}
                        onChange={handleInputChange}
                        placeholder="Nama penerbit"
                        required
                        error={errors.publisher}
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
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        placeholder="Contoh: 14 x 20 cm"
                        icon={faRuler}
                    />
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <FormInput
                        label="Penulis"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        placeholder="Nama penulis"
                        required
                        error={errors.author}
                        icon={faUser}
                    />

                    <FormInput
                        label="Jumlah Halaman"
                        name="pages"
                        type="number"
                        value={formData.pages}
                        onChange={handleInputChange}
                        placeholder="Jumlah halaman"
                        required
                        error={errors.pages}
                        min="1"
                    />

                    <FormInput
                        label="Kategori"
                        name="category"
                        type="select"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        error={errors.category}
                        options={categories}
                    />

                    {/* Cover Image Upload */}
                    <FormInput
                        label="Cover Buku"
                        name="cover"
                        type="file"
                        onChange={handleInputChange}
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
                                    width={200} height={300}
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
                name="synopsis"
                type="textarea"
                value={formData.synopsis}
                onChange={handleInputChange}
                placeholder="Tulis sinopsis buku..."
                required
                error={errors.synopsis}
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
