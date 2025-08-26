'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faEdit, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Modal from '@/components/ui/Modal/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal/ConfirmationModal';
import Notification from '@/components/ui/Notification/Notification';
import {
  getProfileHero,
  createProfileHero,
  updateProfileHero,
  deleteProfileHero,
  getProfileHistory,
  createProfileHistory,
  updateProfileHistory,
  deleteProfileHistory,
} from '../../../services/api';

export default function AdminProfilPage() {
  const [hero, setHero] = useState({ title: '', subtitle: '', description: '', stats: [] });
  const [loadingHero, setLoadingHero] = useState(true);
  const [savingHero, setSavingHero] = useState(false);
  const [deleteHeroModal, setDeleteHeroModal] = useState(false);

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyForm, setHistoryForm] = useState({ year: '', title: '', description: '', order: 0 });
  const [editingHistory, setEditingHistory] = useState(null);
  const [deleteHistoryItem, setDeleteHistoryItem] = useState(null);
  const [historySaving, setHistorySaving] = useState(false);

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ id: Date.now(), message, type });
  };

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await getProfileHero();
        setHero(res.data || { title: '', subtitle: '', description: '', stats: [] });
      } catch (e) {
        showNotification(e.message || 'Gagal memuat data hero', 'error');
      } finally {
        setLoadingHero(false);
      }
    };
    const fetchHistory = async () => {
      try {
        const res = await getProfileHistory();
        setHistory(res.data || []);
      } catch (e) {
        showNotification(e.message || 'Gagal memuat data sejarah', 'error');
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHero();
    fetchHistory();
  }, []);

  const handleHeroChange = (field, value) => {
    setHero((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (index, field, value) => {
    setHero((prev) => {
      const stats = [...prev.stats];
      stats[index] = { ...stats[index], [field]: value };
      return { ...prev, stats };
    });
  };

  const addStat = () => {
    setHero((prev) => ({
      ...prev,
      stats: [...prev.stats, { number: 0, label: '', suffix: '', icon: '' }],
    }));
  };

  const removeStat = (index) => {
    setHero((prev) => ({ ...prev, stats: prev.stats.filter((_, i) => i !== index) }));
  };

  const saveHero = async (e) => {
    e.preventDefault();
    setSavingHero(true);
    try {
      const payload = {
        title: hero.title,
        subtitle: hero.subtitle,
        description: hero.description,
        stats: hero.stats.map((s, idx) => ({
          number: Number(s.number),
          label: s.label,
          suffix: s.suffix,
          icon: s.icon,
          order: idx,
        })),
      };
      if (hero.id) {
        await updateProfileHero(payload);
      } else {
        await createProfileHero(payload);
      }
      showNotification('Hero berhasil disimpan');
      const res = await getProfileHero();
      setHero(res.data || { title: '', subtitle: '', description: '', stats: [] });
    } catch (e) {
      showNotification(e.message || 'Gagal menyimpan hero', 'error');
    } finally {
      setSavingHero(false);
    }
  };

  const confirmDeleteHero = async () => {
    try {
      await deleteProfileHero();
      setHero({ title: '', subtitle: '', description: '', stats: [] });
      showNotification('Hero berhasil dihapus');
    } catch (e) {
      showNotification(e.message || 'Gagal menghapus hero', 'error');
    } finally {
      setDeleteHeroModal(false);
    }
  };

  const openHistoryModal = (item = null) => {
    if (item) {
      setHistoryForm({ year: item.year, title: item.title, description: item.description, order: item.order });
      setEditingHistory(item);
    } else {
      setHistoryForm({ year: '', title: '', description: '', order: history.length });
      setEditingHistory(null);
    }
    setHistoryModalOpen(true);
  };

  const saveHistory = async (e) => {
    e.preventDefault();
    setHistorySaving(true);
    try {
      if (editingHistory) {
        await updateProfileHistory(editingHistory.id, historyForm);
        showNotification('Riwayat berhasil diperbarui');
      } else {
        await createProfileHistory(historyForm);
        showNotification('Riwayat berhasil ditambahkan');
      }
      const res = await getProfileHistory();
      setHistory(res.data || []);
      setHistoryModalOpen(false);
    } catch (e) {
      showNotification(e.message || 'Gagal menyimpan riwayat', 'error');
    } finally {
      setHistorySaving(false);
    }
  };

  const confirmDeleteHistory = async () => {
    if (!deleteHistoryItem) return;
    try {
      await deleteProfileHistory(deleteHistoryItem.id);
      showNotification('Riwayat berhasil dihapus');
      const res = await getProfileHistory();
      setHistory(res.data || []);
    } catch (e) {
      showNotification(e.message || 'Gagal menghapus riwayat', 'error');
    } finally {
      setDeleteHistoryItem(null);
    }
  };

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-semibold mb-4">Profile Management</h1>

      {/* Hero Section */}
      <section className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Hero</h2>
        {loadingHero ? (
          <div className="flex items-center gap-2"><FontAwesomeIcon icon={faSpinner} spin /> Loading...</div>
        ) : (
          <form onSubmit={saveHero} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Judul</label>
              <input
                type="text"
                value={hero.title}
                onChange={(e) => handleHeroChange('title', e.target.value)}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subjudul</label>
              <input
                type="text"
                value={hero.subtitle}
                onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deskripsi</label>
              <textarea
                value={hero.description}
                onChange={(e) => handleHeroChange('description', e.target.value)}
                className="w-full border rounded p-2"
                rows={3}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Statistik</label>
                <button type="button" onClick={addStat} className="flex items-center text-sm text-blue-600">
                  <FontAwesomeIcon icon={faPlus} className="mr-1" /> Tambah Stat
                </button>
              </div>
              {hero.stats.map((stat, idx) => (
                <div key={idx} className="grid grid-cols-5 gap-2 mb-2 items-end">
                  <input
                    type="number"
                    value={stat.number}
                    onChange={(e) => handleStatChange(idx, 'number', e.target.value)}
                    className="border rounded p-2"
                    placeholder="Angka"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                    className="border rounded p-2 col-span-2"
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={stat.suffix || ''}
                    onChange={(e) => handleStatChange(idx, 'suffix', e.target.value)}
                    className="border rounded p-2"
                    placeholder="Suffix"
                  />
                  <button type="button" onClick={() => removeStat(idx)} className="text-red-600">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={savingHero}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {savingHero ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Simpan'}
              </button>
              {hero.id && (
                <button
                  type="button"
                  onClick={() => setDeleteHeroModal(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Hapus
                </button>
              )}
            </div>
          </form>
        )}
      </section>

      {/* History Section */}
      <section className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Sejarah</h2>
          <button
            onClick={() => openHistoryModal()}
            className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-1" /> Tambah
          </button>
        </div>
        {loadingHistory ? (
          <div className="flex items-center gap-2"><FontAwesomeIcon icon={faSpinner} spin /> Loading...</div>
        ) : history.length === 0 ? (
          <p className="text-gray-500">Belum ada data sejarah.</p>
        ) : (
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Tahun</th>
                <th className="p-2 border">Judul</th>
                <th className="p-2 border">Urutan</th>
                <th className="p-2 border w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-2 border">{item.year}</td>
                  <td className="p-2 border">{item.title}</td>
                  <td className="p-2 border">{item.order}</td>
                  <td className="p-2 border">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openHistoryModal(item)}
                        className="text-blue-600"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => setDeleteHistoryItem(item)}
                        className="text-red-600"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* History Modal */}
      <Modal isOpen={historyModalOpen} onClose={() => setHistoryModalOpen(false)} title={editingHistory ? 'Edit Riwayat' : 'Tambah Riwayat'}>
        <form onSubmit={saveHistory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tahun</label>
            <input
              type="text"
              value={historyForm.year}
              onChange={(e) => setHistoryForm({ ...historyForm, year: e.target.value })}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Judul</label>
            <input
              type="text"
              value={historyForm.title}
              onChange={(e) => setHistoryForm({ ...historyForm, title: e.target.value })}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
              value={historyForm.description}
              onChange={(e) => setHistoryForm({ ...historyForm, description: e.target.value })}
              className="w-full border rounded p-2"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Urutan</label>
            <input
              type="number"
              value={historyForm.order}
              onChange={(e) => setHistoryForm({ ...historyForm, order: Number(e.target.value) })}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setHistoryModalOpen(false)} className="px-4 py-2 border rounded">Batal</button>
            <button type="submit" disabled={historySaving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {historySaving ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Hero Delete Confirmation */}
      <ConfirmationModal
        isOpen={deleteHeroModal}
        onClose={() => setDeleteHeroModal(false)}
        onConfirm={confirmDeleteHero}
        message="Hapus hero saat ini?"
        confirmText="Hapus"
      />

      {/* History Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deleteHistoryItem}
        onClose={() => setDeleteHistoryItem(null)}
        onConfirm={confirmDeleteHistory}
        message="Hapus riwayat ini?"
        confirmText="Hapus"
      />

      {notification && (
        <Notification
          id={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

