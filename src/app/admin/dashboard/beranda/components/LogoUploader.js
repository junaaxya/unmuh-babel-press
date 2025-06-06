import { useState, useRef } from 'react';
import Button from '@/components/ui/button/Button';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { uploadLogo, deleteLogo } from '@/app/services/api';
import Image from 'next/image';

export default function LogoUploader({ 
    logoUrl, 
    onSuccess, 
    setNotification,
    maxSize = 5 * 1024 * 1024, // 5MB default
    acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const validateFile = (selectedFile) => {
        if (!selectedFile) return { valid: false, error: 'Tidak ada file yang dipilih' };
        
        if (!acceptedTypes.includes(selectedFile.type)) {
            return { 
                valid: false, 
                error: `Format file tidak didukung. Gunakan: ${acceptedTypes.map(t => t.split('/')[1]).join(', ')}`
            };
        }
        
        if (selectedFile.size > maxSize) {
            return { 
                valid: false, 
                error: `Ukuran file terlalu besar. Maksimal ${(maxSize / 1024 / 1024).toFixed(1)}MB`
            };
        }
        
        return { valid: true };
    };

    const handleFileChange = (selectedFile) => {
        const validation = validateFile(selectedFile);
        
        if (!validation.valid) {
            setNotification({
                type: 'error',
                message: validation.error,
            });
            return;
        }

        setFile(selectedFile);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(selectedFile);
    };

    const handleInputChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            handleFileChange(selectedFile);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileChange(droppedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setNotification({
                type: 'error',
                message: 'Pilih file logo terlebih dahulu',
            });
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Simulate progress for better UX
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 100);

            await uploadLogo(file);
            
            clearInterval(progressInterval);
            setUploadProgress(100);
            
            setTimeout(() => {
                setNotification({
                    type: 'success',
                    message: 'Logo berhasil diperbarui!',
                });
                setFile(null);
                setPreview(null);
                setUploadProgress(0);
                onSuccess();
            }, 500);

        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Gagal memperbarui logo. Silakan coba lagi.',
            });
            setUploadProgress(0);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteLogo();
            setNotification({ 
                type: 'success', 
                message: 'Logo berhasil dihapus!' 
            });
            onSuccess();
            setConfirmOpen(false);
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Gagal menghapus logo. Silakan coba lagi.',
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const currentImage = preview || logoUrl;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Logo Perusahaan</h2>
                        <p className="text-sm text-gray-500">Upload logo untuk ditampilkan di header website</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Current Logo Display */}
                {currentImage && (
                    <div className="relative">
                        <div className="relative w-full max-w-sm mx-auto p-6 rounded-xl overflow-hidden bg-gray-50 border-2 border-gray-200">
                            <div className="flex items-center justify-center min-h-[120px]">
                                <Image
                                    src={currentImage}
                                    alt="Logo Preview"
                                    width={200}
                                    height={120}
                                    className="max-h-[120px] w-auto object-contain"
                                    sizes="(max-width: 768px) 100vw, 200px"
                                />
                            </div>
                            {preview && (
                                <div className="absolute top-3 right-3">
                                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                        Preview
                                    </span>
                                </div>
                            )}
                        </div>
                        {file && (
                            <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                                <span>📁 {file.name}</span>
                                <span>{(file.size / 1024 / 1024).toFixed(2)}MB</span>
                            </div>
                        )}
                    </div>
                )}

                {/* File Upload Area */}
                <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                        dragActive 
                            ? 'border-orange-400 bg-orange-50' 
                            : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={acceptedTypes.join(',')}
                        onChange={handleInputChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        
                        <div>
                            <p className="text-lg font-medium text-gray-900">
                                {dragActive ? 'Lepaskan file di sini' : 'Drag & drop logo di sini'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                atau <span className="text-orange-600 font-medium">klik untuk pilih file</span>
                            </p>
                        </div>
                        
                        <div className="text-xs text-gray-400 space-y-1">
                            <p>Format: {acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}</p>
                            <p>Ukuran maksimal: {(maxSize / 1024 / 1024).toFixed(1)}MB</p>
                            <p>Rekomendasi: Logo dengan background transparan (PNG)</p>
                        </div>
                    </div>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Mengupload...</span>
                            <span className="text-orange-600 font-medium">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {file && (
                        <>
                            <Button
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                            >
                                {isUploading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Mengupload...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        Upload Logo
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={clearFile}
                                disabled={isUploading}
                                className="sm:w-auto"
                            >
                                Batal
                            </Button>
                        </>
                    )}
                    
                    {logoUrl && !file && (
                        <Button
                            variant="danger"
                            onClick={() => setConfirmOpen(true)}
                            disabled={isDeleting}
                            className="sm:w-auto"
                        >
                            {isDeleting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Menghapus...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Hapus Logo
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>

            {/* Confirm Delete Modal */}
            {confirmOpen && (
                <ConfirmDeleteModal
                    title="Hapus Logo"
                    message="Apakah Anda yakin ingin menghapus logo? Tindakan ini tidak dapat dibatalkan."
                    confirmText="Ya, Hapus"
                    cancelText="Batal"
                    isLoading={isDeleting}
                    onCancel={() => setConfirmOpen(false)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}