// src/components/admin/berita-event/ImageUploader.js
'use client';

import { useState, useRef } from 'react';
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

export default function ImageUploader({ currentImage, onUpload, error }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(currentImage || '');
  const fileInputRef = useRef(null);

  // Allowed file types and max size (5MB)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
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

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      // Simulate upload to Cloudinary
      // In real implementation, you would upload to Cloudinary here
      await simulateUpload(file);
      
      // For demo purposes, we'll use the preview URL
      onUpload(URL.createObjectURL(file));
      
    } catch (error) {
      setUploadError('Gagal mengupload gambar. Silakan coba lagi.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const simulateUpload = (file) => {
    return new Promise((resolve, reject) => {
      // Simulate upload delay
      setTimeout(() => {
        // Simulate random success/failure for demo
        if (Math.random() > 0.1) { // 90% success rate
          resolve({
            secure_url: `https://example.com/uploads/${file.name}`,
            public_id: `uploads/${Date.now()}`
          });
        } else {
          reject(new Error('Upload failed'));
        }
      }, 2000);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Preview or Upload Area */}
      {previewImage ? (
        <div className="relative">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={previewImage}
              alt="Preview"
              className="w-full h-48 object-cover"
              width={200} height={300}
            />
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="flex space-x-2">
                <button
                  onClick={openFileDialog}
                  disabled={isUploading}
                  className="bg-white text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faImage} className="mr-1" />
                  Ganti
                </button>
                <button
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-1" />
                  Hapus
                </button>
              </div>
            </div>

            {/* Upload progress overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                <div className="text-center">
                  <FontAwesomeIcon 
                    icon={faSpinner} 
                    className="text-blue-500 text-2xl animate-spin mb-2" 
                  />
                  <p className="text-sm text-gray-600">Mengupload...</p>
                </div>
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
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${error ? 'border-red-300 bg-red-50' : ''}
          `}
        >
          <div className="space-y-4">
            <FontAwesomeIcon 
              icon={faCloudUploadAlt} 
              className={`text-4xl ${
                dragActive ? 'text-blue-500' : 
                error ? 'text-red-400' : 'text-gray-400'
              }`} 
            />
            
            <div>
              <p className="text-lg font-medium text-gray-900 mb-1">
                {dragActive ? 'Lepaskan file di sini' : 'Upload Gambar'}
              </p>
              <p className="text-sm text-gray-500">
                Drag & drop atau klik untuk memilih file
              </p>
            </div>

            <div className="text-xs text-gray-400">
              <p>Format: JPG, PNG, WebP</p>
              <p>Maksimal: 5MB</p>
            </div>
          </div>

          {isUploading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <FontAwesomeIcon 
                  icon={faSpinner} 
                  className="text-blue-500 text-2xl animate-spin mb-2" 
                />
                <p className="text-sm text-gray-600">Mengupload...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Messages */}
      {(error || uploadError) && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>{error || uploadError}</span>
        </div>
      )}

      {/* Success Message */}
      {previewImage && !isUploading && !error && !uploadError && (
        <div className="flex items-center space-x-2 text-green-600 text-sm">
          <FontAwesomeIcon icon={faCheck} />
          <span>Gambar berhasil diupload</span>
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