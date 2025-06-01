'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faEdit,
    faTrash,
    faEye,
    faSave,
    faTimes,
    faImage,
    faSpinner,
    faToggleOn,
    faToggleOff,
} from '@fortawesome/free-solid-svg-icons';

// Form Component for Hero Section
const HeroSectionForm = ({ data, onSave, onCancel, loading }) => {
    const [formData, setFormData] = useState({
        title: data?.title || '',
        subtitle: data?.subtitle || '',
        description: data?.description || '',
        buttonText: data?.buttonText || 'Jelajahi Katalog',
        buttonLink: data?.buttonLink || '/catalog',
        backgroundImage: data?.backgroundImage || '',
        isActive: data?.isActive ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    {data ? 'Edit Hero Section' : 'Tambah Hero Section'}
                </h3>
                <div className="flex space-x-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                        <FontAwesomeIcon
                            icon={faTimes}
                            className="w-4 h-4 mr-2"
                        />
                        Batal
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Judul Utama *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                handleChange('title', e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Masukkan judul utama"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subjudul
                        </label>
                        <input
                            type="text"
                            value={formData.subtitle}
                            onChange={(e) =>
                                handleChange('subtitle', e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Masukkan subjudul"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) =>
                            handleChange('description', e.target.value)
                        }
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Masukkan deskripsi"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Teks Tombol
                        </label>
                        <input
                            type="text"
                            value={formData.buttonText}
                            onChange={(e) =>
                                handleChange('buttonText', e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Teks tombol"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Link Tombol
                        </label>
                        <input
                            type="text"
                            value={formData.buttonLink}
                            onChange={(e) =>
                                handleChange('buttonLink', e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="/catalog"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background Image URL
                    </label>
                    <div className="flex space-x-2">
                        <input
                            type="url"
                            value={formData.backgroundImage}
                            onChange={(e) =>
                                handleChange('backgroundImage', e.target.value)
                            }
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/image.jpg"
                        />
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                        >
                            <FontAwesomeIcon
                                icon={faImage}
                                className="w-4 h-4"
                            />
                        </button>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Status Aktif
                    </label>
                    <button
                        type="button"
                        onClick={() =>
                            handleChange('isActive', !formData.isActive)
                        }
                        className={`${
                            formData.isActive
                                ? 'text-green-600'
                                : 'text-gray-400'
                        } hover:opacity-80 transition-colors duration-200`}
                    >
                        <FontAwesomeIcon
                            icon={formData.isActive ? faToggleOn : faToggleOff}
                            className="w-8 h-8"
                        />
                    </button>
                    <span className="text-sm text-gray-600">
                        {formData.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {loading ? (
                            <>
                                <FontAwesomeIcon
                                    icon={faSpinner}
                                    className="w-4 h-4 mr-2 animate-spin"
                                />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon
                                    icon={faSave}
                                    className="w-4 h-4 mr-2"
                                />
                                Simpan
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Data Card Component
const DataCard = ({ data, onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {data.backgroundImage && (
                <div
                    className="h-32 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${data.backgroundImage})` }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                </div>
            )}

            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {data.title}
                        </h3>
                        {data.subtitle && (
                            <p className="text-sm text-gray-600 mb-2">
                                {data.subtitle}
                            </p>
                        )}
                        <p className="text-sm text-gray-700 line-clamp-3">
                            {data.description}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                        <button
                            onClick={() => onToggleStatus(data.id)}
                            className={`${
                                data.isActive
                                    ? 'text-green-600'
                                    : 'text-gray-400'
                            } hover:opacity-80 transition-colors duration-200`}
                        >
                            <FontAwesomeIcon
                                icon={data.isActive ? faToggleOn : faToggleOff}
                                className="w-6 h-6"
                            />
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                data.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            {data.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                        {data.buttonText && (
                            <span className="text-xs text-gray-500">
                                Tombol: {data.buttonText}
                            </span>
                        )}
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(data)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Edit"
                        >
                            <FontAwesomeIcon
                                icon={faEdit}
                                className="w-4 h-4"
                            />
                        </button>
                        <button
                            onClick={() => onDelete(data.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Hapus"
                        >
                            <FontAwesomeIcon
                                icon={faTrash}
                                className="w-4 h-4"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onConfirm, onCancel, itemTitle }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={onCancel}
            ></div>
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 relative z-10">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Konfirmasi Hapus
                </h3>
                <p className="text-gray-600 mb-6">
                    Apakah Anda yakin ingin menghapus {itemTitle}? Tindakan ini
                    tidak dapat dibatalkan.
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function BerandaPage() {
    const [heroSections, setHeroSections] = useState([
        {
            id: 1,
            title: 'Selamat Datang di UNMUH Babel Press',
            subtitle: 'Penerbit Terpercaya untuk Karya Ilmiah',
            description:
                'Menerbitkan buku-buku berkualitas tinggi dalam bidang pendidikan, penelitian, dan pengembangan ilmu pengetahuan untuk kemajuan bangsa.',
            buttonText: 'Jelajahi Katalog',
            buttonLink: '/catalog',
            backgroundImage:
                'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3',
            isActive: true,
        },
        {
            id: 2,
            title: 'Publikasi Karya Ilmiah Berkualitas',
            subtitle: 'Platform Terbaik untuk Peneliti',
            description:
                'Kami berkomitmen membantu para peneliti dan akademisi dalam mempublikasikan karya-karya ilmiah yang bermanfaat bagi masyarakat.',
            buttonText: 'Mulai Publikasi',
            buttonLink: '/submit',
            backgroundImage:
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3',
            isActive: false,
        },
    ]);

    const [showForm, setShowForm] = useState(false);
    const [editingData, setEditingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        itemId: null,
        itemTitle: '',
    });

    const handleAdd = () => {
        setEditingData(null);
        setShowForm(true);
    };

    const handleEdit = (data) => {
        setEditingData(data);
        setShowForm(true);
    };

    const handleSave = async (formData) => {
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            if (editingData) {
                // Update existing
                setHeroSections((prev) =>
                    prev.map((item) =>
                        item.id === editingData.id
                            ? { ...formData, id: editingData.id }
                            : item
                    )
                );
            } else {
                // Add new
                const newItem = {
                    ...formData,
                    id: Date.now(), // Simple ID generation
                };
                setHeroSections((prev) => [...prev, newItem]);
            }

            setShowForm(false);
            setEditingData(null);
            setLoading(false);
        }, 1000);
    };

    const handleDelete = (id) => {
        const item = heroSections.find((h) => h.id === id);
        setDeleteModal({
            isOpen: true,
            itemId: id,
            itemTitle: item?.title || '',
        });
    };

    const confirmDelete = () => {
        setHeroSections((prev) =>
            prev.filter((item) => item.id !== deleteModal.itemId)
        );
        setDeleteModal({ isOpen: false, itemId: null, itemTitle: '' });
    };

    const handleToggleStatus = (id) => {
        setHeroSections((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, isActive: !item.isActive } : item
            )
        );
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingData(null);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Kelola Beranda
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Atur hero section dan konten utama halaman beranda
                        </p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                    >
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="w-4 h-4 mr-2"
                        />
                        Tambah Hero Section
                    </button>
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <HeroSectionForm
                    data={editingData}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    loading={loading}
                />
            )}

            {/* Hero Sections List */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                    Hero Sections ({heroSections.length})
                </h2>

                {heroSections.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <FontAwesomeIcon
                            icon={faImage}
                            className="w-12 h-12 text-gray-400 mb-4"
                        />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Belum Ada Hero Section
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Tambahkan hero section pertama untuk halaman beranda
                        </p>
                        <button
                            onClick={handleAdd}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="w-4 h-4 mr-2"
                            />
                            Tambah Hero Section
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {heroSections.map((hero) => (
                            <DataCard
                                key={hero.id}
                                data={hero}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onToggleStatus={handleToggleStatus}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={deleteModal.isOpen}
                onConfirm={confirmDelete}
                onCancel={() =>
                    setDeleteModal({
                        isOpen: false,
                        itemId: null,
                        itemTitle: '',
                    })
                }
                itemTitle={deleteModal.itemTitle}
            />
        </div>
    );
}
