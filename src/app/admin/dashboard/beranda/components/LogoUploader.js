import { useState } from 'react';
import Button from '@/components/ui/button/Button';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { uploadLogo, deleteLogo } from '@/app/services/api';
import Image from 'next/image';

export default function LogoUploader({ logoUrl, onSuccess, setNotification }) {
    const [file, setFile] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleUpload = async () => {
        try {
            await uploadLogo(file);
            setNotification({
                type: 'success',
                message: 'Logo berhasil diunggah!',
            });
            onSuccess();
        } catch {
            setNotification({
                type: 'error',
                message: 'Gagal mengunggah logo.',
            });
        }
    };

    const handleDelete = async () => {
        try {
            await deleteLogo();
            setNotification({ type: 'success', message: 'Logo dihapus!' });
            onSuccess();
            setConfirmOpen(false);
        } catch {
            setNotification({
                type: 'error',
                message: 'Gagal menghapus logo.',
            });
        }
    };

    return (
        <div className="p-4 border rounded space-y-4">
            <h2 className="text-lg font-semibold">Logo Kiri Atas</h2>
            {logoUrl && (
                <Image
                    width={100}
                    height={100}
                    src={logoUrl}
                    alt="Logo"
                    className="h-16"
                />
            )}
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <div className="space-x-2">
                <Button onClick={handleUpload}>Unggah</Button>
                {logoUrl && (
                    <Button
                        variant="danger"
                        onClick={() => setConfirmOpen(true)}
                    >
                        Hapus Logo
                    </Button>
                )}
            </div>
            {confirmOpen && (
                <ConfirmDeleteModal
                    message="Yakin ingin menghapus logo?"
                    onCancel={() => setConfirmOpen(false)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}
