// src/components/admin/berita-event/ImageUploader.js
'use client';

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCloudUploadAlt, 
  faImage, 
  faTimes, 
  faSpinner,
  faCheck,
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
// Pastikan path ini benar dan fungsi-fungsi ini sudah ada di services/api.js
import { uploadImage } from '../../../app/services/api'; 

export default function ImageUploader({ currentImage, onUpload, folder, error: formError }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(currentImage || '');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreviewImage(currentImage || '');
  }, [currentImage]);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    if (!file) return 'File tidak ditemukan.';
    if (!allowedTypes.includes(file.type)) {
      return 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP.';
    }
    if (file.size > maxSize) {
      return 'Ukuran file terlalu besar. Maksimal 5MB.';
    }
    return null;
  };

  const handleFileSelect = async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setPreviewImage(URL.createObjectURL(file));

    try {
      // Panggil fungsi upload yang baru, yang mengirim file ke backend Anda
      const response = await uploadImage(file, folder);
      // Backend Anda mengembalikan { url: '...' }, jadi kita ambil URL-nya
      onUpload(response.url); 
      setPreviewImage(response.url);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.message || 'Gagal mengunggah gambar. Silakan coba lagi.';
      setUploadError(errorMessage);
      setPreviewImage(currentImage || '');
      onUpload(currentImage || '');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage('');
    onUpload('');
  };

  const openFileDialog = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };
  
  // Gabungkan error dari form dan error dari upload
  const finalError = formError || uploadError;

  return (
    <div className="space-y-4">
      {/* Input file tersembunyi */}
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Area Preview atau Upload */}
      {previewImage ? (
        <div className="relative group">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden border">
            <Image
              src={previewImage}
              alt="Preview"
              className="w-full h-48 object-cover"
              width={300} height={192}
              unoptimized // Diperlukan untuk blob URL dan URL eksternal agar Next.js tidak mencoba mengoptimalkannya
            />
            
            {/* Overlay dengan tombol aksi */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
              {!isUploading && (
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={openFileDialog} className="bg-white text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50">
                    <FontAwesomeIcon icon={faImage} className="mr-1" /> Ganti
                  </button>
                  <button type="button" onClick={handleRemoveImage} className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50">
                    <FontAwesomeIcon icon={faTimes} className="mr-1" /> Hapus
                  </button>
                </div>
              )}
            </div>

            {/* Overlay saat proses upload */}
            {isUploading && (
              <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center">
                <FontAwesomeIcon icon={faSpinner} className="text-blue-500 text-3xl animate-spin mb-2" />
                <p className="text-sm font-medium text-gray-700">Mengunggah...</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${finalError ? 'border-red-400 bg-red-50' : ''}
            ${isUploading ? 'cursor-not-allowed bg-gray-100' : ''}
          `}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <FontAwesomeIcon 
              icon={faCloudUploadAlt} 
              className={`text-4xl ${finalError ? 'text-red-400' : 'text-gray-400'}`} 
            />
            <div>
              <p className="font-medium text-gray-700">{dragActive ? 'Lepaskan file di sini' : 'Seret & lepas atau klik untuk mengunggah'}</p>
              <p className="text-sm text-gray-500">Format: JPG, PNG, WebP (Maks. 5MB)</p>
            </div>
          </div>
        </div>
      )}

      {/* Pesan Error */}
      {finalError && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>{finalError}</span>
        </div>
      )}

      {/* Pesan Sukses (setelah upload selesai dan sebelum form disubmit) */}
      {previewImage && !isUploading && !finalError && (
        <div className="flex items-center space-x-2 text-green-600 text-sm">
          <FontAwesomeIcon icon={faCheck} />
          <span>Gambar berhasil diunggah dan siap disimpan.</span>
        </div>
      )}

      {/* Upload Tips */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 <strong>Tips:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Gunakan gambar dengan rasio 16:9 untuk hasil terbaik</li>
          <li>Resolusi minimal 800x600 pixel</li>
          <li>Pastikan gambar relevan dengan konten</li>
        </ul>
      </div>
    </div>
  );
}
