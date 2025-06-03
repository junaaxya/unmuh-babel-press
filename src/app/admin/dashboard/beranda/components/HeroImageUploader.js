import { useState } from 'react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { uploadHeroImage, deleteHeroImage } from '../../../../services/api';
import Button from '@/components/ui/button/Button';

export default function HeroImageUploader({ imageUrl, onSuccess, setNotification }) {
  const [file, setFile] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleUpload = async () => {
    try {
      await uploadHeroImage(file);
      setNotification({ type: 'success', message: 'Gambar berhasil diperbarui.' });
      onSuccess();
    } catch {
      setNotification({ type: 'error', message: 'Gagal memperbarui gambar.' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHeroImage();
      setNotification({ type: 'success', message: 'Gambar dihapus.' });
      onSuccess();
      setConfirmOpen(false);
    } catch {
      setNotification({ type: 'error', message: 'Gagal menghapus gambar.' });
    }
  };

  return (
    <div className="p-4 border rounded space-y-4">
      <h2 className="text-lg font-semibold">Gambar Hero</h2>
      {imageUrl && <img src={imageUrl} alt="Hero" className="w-full max-w-xl" />}
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <div className="space-x-2">
        <Button onClick={handleUpload}>Unggah</Button>
        {imageUrl && <Button variant="danger" onClick={() => setConfirmOpen(true)}>Hapus Gambar</Button>}
      </div>
      {confirmOpen && (
        <ConfirmDeleteModal
          message="Yakin ingin menghapus gambar hero?"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
