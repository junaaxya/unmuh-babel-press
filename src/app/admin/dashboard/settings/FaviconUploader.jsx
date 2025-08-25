'use client';
import { useState } from 'react';
import { uploadFavicon } from '@/app/services/api';

export default function FaviconUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadFavicon(file);
      onChange(res.url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {value && (
        <img src={value} alt="favicon" className="w-8 h-8" />
      )}
      <input
        type="file"
        accept=".ico,.png,.svg"
        onChange={handleFile}
        disabled={uploading}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
