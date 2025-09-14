'use client';
import { useState } from 'react';
import { uploadFavicon } from '@/app/services/api';
import Image from 'next/image';
import { useGlobalNotification } from '@/hooks/useNotification';

export default function FaviconUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const { showNotification } = useGlobalNotification();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFavicon(file);
      onChange(res.url);
      showNotification('success', 'Favicon berhasil diunggah!');
    } catch (err) {
      showNotification('error', err.message || 'Upload gagal');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {value && (
        <Image
          src={value}
          alt="favicon"
          width={32}
          height={32}
          className="w-8 h-8"
        />
      )}
      <input
        type="file"
        accept=".ico,.png,.svg"
        onChange={handleFile}
        disabled={uploading}
      />
    </div>
  );
}
