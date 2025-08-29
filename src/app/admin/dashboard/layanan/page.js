"use client";

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEye, 
  faSearch,
  faTags,
  faMoneyBillWave,
  faListCheck,
  faFilter
} from '@fortawesome/free-solid-svg-icons';

import Modal from '@/components/ui/Modal/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal/ConfirmationModal';
import FormInput from '@/components/ui/FormInput/FormInput';
import Button from '@/components/ui/button/Button';
import PackageFormModal from '@/components/admin/layanan/PackageFormModal';
import PackageCard from '@/components/admin/layanan/PackageCard';
import { useNotification } from '@/hooks/useNotification';

export default function AdminLayananPage() {
  // State Management
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterPriceRange, setFilterPriceRange] = useState('all');
  
  // Modal States
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'
  
  const { showNotification } = useNotification();

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/layanan');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const mapped = (data.data || []).map(pkg => ({
        ...pkg,
        price: `Rp ${pkg.price.toLocaleString('id-ID')}`,
        priceNumber: pkg.price,
        bgColor: pkg.bgColor || 'bg-gray-800',
        textColor: pkg.textColor || 'text-white',
        badge: pkg.isPopular ? { text: 'POPULER', color: 'bg-red-500' } : null,
        isActive: pkg.isActive !== false,
        createdAt: new Date(pkg.createdAt),
        updatedAt: new Date(pkg.updatedAt),
      }));
      setPackages(mapped);
      setFilteredPackages(mapped);
    } catch (error) {
      console.error(error);
      showNotification('error', 'Gagal memuat paket');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter and Search Effect
  useEffect(() => {
    let filtered = [...packages];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(pkg => 
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.features.some(feature => 
          typeof feature === 'string' 
            ? feature.toLowerCase().includes(searchTerm.toLowerCase())
            : feature.text?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Price range filter
    if (filterPriceRange !== 'all') {
      switch (filterPriceRange) {
        case 'low':
          filtered = filtered.filter(pkg => pkg.priceNumber < 500000);
          break;
        case 'medium':
          filtered = filtered.filter(pkg => pkg.priceNumber >= 500000 && pkg.priceNumber < 900000);
          break;
        case 'high':
          filtered = filtered.filter(pkg => pkg.priceNumber >= 900000);
          break;
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'price':
          aVal = a.priceNumber;
          bVal = b.priceNumber;
          break;
        case 'features':
          aVal = a.features.length;
          bVal = b.features.length;
          break;
        case 'created':
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
          break;
        default:
          aVal = a.title;
          bVal = b.title;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredPackages(filtered);
  }, [packages, searchTerm, sortBy, sortOrder, filterPriceRange]);

  // CRUD Operations
  const handleCreate = () => {
    setFormMode('create');
    setSelectedPackage(null);
    setShowFormModal(true);
  };

  const handleEdit = (pkg) => {
    setFormMode('edit');
    setSelectedPackage(pkg);
    setShowFormModal(true);
  };

  const handleView = (pkg) => {
    setSelectedPackage(pkg);
    setShowViewModal(true);
  };

  const handleDeleteConfirm = (pkg) => {
    setSelectedPackage(pkg);
    setShowDeleteModal(true);
  };

  const handleSave = async (packageData) => {
    try {
      const payload = {
        title: packageData.title,
        price: packageData.priceNumber,
        features: packageData.features,
        isPopular: !!packageData.badge,
        bgColor: packageData.bgColor,
        textColor: packageData.textColor,
        isActive: packageData.isActive,
      };
      const url = formMode === 'create'
        ? '/api/admin/layanan'
        : `/api/admin/layanan/${selectedPackage.id}`;
      const method = formMode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save');
      showNotification('success', formMode === 'create' ? 'Paket berhasil ditambahkan!' : 'Paket berhasil diperbarui!');
      await fetchPackages();
    } catch (error) {
      console.error(error);
      showNotification('error', formMode === 'create' ? 'Gagal menambahkan paket' : 'Gagal memperbarui paket');
    } finally {
      setShowFormModal(false);
      setSelectedPackage(null);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/layanan/${selectedPackage.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      showNotification('success', 'Paket berhasil dihapus!');
      await fetchPackages();
    } catch (error) {
      console.error(error);
      showNotification('error', 'Gagal menghapus paket');
    } finally {
      setShowDeleteModal(false);
      setSelectedPackage(null);
    }
  };

  const handleToggleStatus = async (pkg) => {
    try {
      const payload = {
        title: pkg.title,
        price: pkg.priceNumber,
        features: pkg.features,
        isPopular: !!pkg.badge,
        bgColor: pkg.bgColor,
        textColor: pkg.textColor,
        isActive: !pkg.isActive,
      };
      const res = await fetch(`/api/admin/layanan/${pkg.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to toggle');
      showNotification('success', pkg.isActive ? 'Paket dinonaktifkan' : 'Paket diaktifkan');
      await fetchPackages();
    } catch (error) {
      console.error(error);
      showNotification('error', 'Gagal mengubah status paket');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Manajemen Layanan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola paket penerbitan Unmuh Babel Press
          </p>
        </div>
        
        <Button
          variant="primary"
          icon={faPlus}
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Tambah Paket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Paket</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{packages.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FontAwesomeIcon icon={faTags} className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Paket Aktif</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {packages.filter(p => p.isActive).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <FontAwesomeIcon icon={faListCheck} className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Harga Terendah</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.min(...packages.map(p => p.priceNumber)).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Harga Tertinggi</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.max(...packages.map(p => p.priceNumber)).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <FormInput
              placeholder="Cari paket atau fitur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={faSearch}
            />
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="title">Urutkan: Nama</option>
            <option value="price">Urutkan: Harga</option>
            <option value="features">Urutkan: Jumlah Fitur</option>
            <option value="created">Urutkan: Tanggal Dibuat</option>
          </select>

          {/* Price Filter */}
          <select
            value={filterPriceRange}
            onChange={(e) => setFilterPriceRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Semua Harga</option>
            <option value="low">{'< 500K'}</option>
            <option value="medium">500K - 900K</option>
            <option value="high">{'>= 900K'}</option>
          </select>
        </div>

        {/* Sort Order Toggle */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faFilter} />
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
          
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan {filteredPackages.length} dari {packages.length} paket
          </span>
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPackages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            package={pkg}
            onEdit={() => handleEdit(pkg)}
            onView={() => handleView(pkg)}
            onDelete={() => handleDeleteConfirm(pkg)}
            onToggleStatus={handleToggleStatus}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Tidak ada paket ditemukan
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mb-4">
            Coba ubah filter pencarian atau tambah paket baru
          </p>
          <Button
            variant="primary"
            icon={faPlus}
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Tambah Paket Pertama
          </Button>
        </div>
      )}

      {/* Modals */}
      {showFormModal && (
        <PackageFormModal
          isOpen={showFormModal}
          onClose={() => {
            setShowFormModal(false);
            setSelectedPackage(null);
          }}
          onSave={handleSave}
          mode={formMode}
          packageData={selectedPackage}
        />
      )}

      {showDeleteModal && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Hapus Paket"
          message={`Apakah Anda yakin ingin menghapus paket "${selectedPackage?.title}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Ya, Hapus"
          cancelText="Batal"
          type="danger"
        />
      )}

      {showViewModal && selectedPackage && (
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title={`Detail Paket ${selectedPackage.title}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Package Preview */}
            <div className="flex justify-center">
              <div className={`card-hover bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden relative max-w-sm`}>
                <div className={`${selectedPackage.bgColor} ${selectedPackage.textColor} p-6 text-center`}>
                  <h3 className="text-2xl font-bold mb-2">{selectedPackage.title}</h3>
                  <div className="text-3xl font-black text-white">{selectedPackage.price}</div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 text-sm">
                    {selectedPackage.features.map((feature, index) => (
                      <li key={index} className={`feature-item ${feature.highlight ? "text-red-600 font-semibold" : ""}`}>
                        {feature.text || feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Harga:</span>
                <p className="text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(selectedPackage.priceNumber || 0)}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                <p className={`${selectedPackage.isActive ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {selectedPackage.isActive ? 'Aktif' : 'Tidak Aktif'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Dibuat:</span>
                <p className="text-gray-900 dark:text-white">
                  {selectedPackage.createdAt ? new Date(selectedPackage.createdAt).toLocaleString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }) : '-'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Terakhir Diupdate:</span>
                <p className="text-gray-900 dark:text-white">
                  {selectedPackage.updatedAt ? new Date(selectedPackage.updatedAt).toLocaleString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }) : '-'}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}