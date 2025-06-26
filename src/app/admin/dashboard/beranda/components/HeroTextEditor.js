import { useState, useEffect } from 'react';
import Button from '@/components/ui/button/Button';
import { updateHeroText } from '@/app/services/api';

export default function HeroTextEditor({ 
    headline, 
    subheadline, 
    onSuccess, 
    setNotification,
    maxHeadlineLength = 100,
    maxSubheadlineLength = 200,
    showPreview = true,
    autoSave = false,
    autoSaveDelay = 2000
}) {
    const [head, setHead] = useState(headline || '');
    const [sub, setSub] = useState(subheadline || '');
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);

    // Track changes
    useEffect(() => {
        const changed = head !== headline || sub !== subheadline;
        setHasChanges(changed);

        // Auto save functionality
        if (autoSave && changed) {
            if (autoSaveTimeout) {
                clearTimeout(autoSaveTimeout);
            }
            
            const timeout = setTimeout(() => {
                handleSave(true); // Silent save
            }, autoSaveDelay);
            
            setAutoSaveTimeout(timeout);
        }

        return () => {
            if (autoSaveTimeout) {
                clearTimeout(autoSaveTimeout);
            }
        };
    }, [head, sub, headline, subheadline, autoSave, autoSaveDelay]);

    const handleSave = async (silent = false) => {
        if (!hasChanges && !silent) {
            setNotification({ 
                type: 'info', 
                message: 'Tidak ada perubahan untuk disimpan.' 
            });
            return;
        }

        setIsSaving(true);
        try {
            await updateHeroText({ headline: head, subheadline: sub });
            
            if (!silent) {
                setNotification({ 
                    type: 'success', 
                    message: 'Teks hero berhasil disimpan!' 
                });
            }
            
            onSuccess();
            setHasChanges(false);
        } catch (error) {
            setNotification({ 
                type: 'error', 
                message: 'Gagal menyimpan teks hero. Silakan coba lagi.' 
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        setHead(headline || '');
        setSub(subheadline || '');
        setHasChanges(false);
    };

    const handleKeyDown = (e) => {
        // Ctrl/Cmd + S untuk save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            handleSave();
        }
        // Escape untuk reset
        if (e.key === 'Escape') {
            handleReset();
        }
    };

    const getCharacterCount = (text, max) => {
        const count = text.length;
        const remaining = max - count;
        const isOverLimit = count > max;
        
        return {
            count,
            remaining,
            isOverLimit,
            percentage: (count / max) * 100
        };
    };

    const headlineStats = getCharacterCount(head, maxHeadlineLength);
    const subheadlineStats = getCharacterCount(sub, maxSubheadlineLength);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Hero Text Editor</h2>
                            <p className="text-sm text-gray-500">Edit teks utama dan deskripsi untuk bagian hero</p>
                        </div>
                    </div>
                    
                    {/* Status Indicator */}
                    <div className="flex items-center gap-2">
                        {hasChanges && (
                            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                Belum disimpan
                            </span>
                        )}
                        {autoSave && (
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                Auto-save aktif
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Headline Input */}
                <div className="space-y-4 mb-6">
                    <div className="space-y-2">
                        <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                            <span>Headline Utama</span>
                            <span className={`text-xs ${headlineStats.isOverLimit ? 'text-red-500' : 'text-gray-400'}`}>
                                {headlineStats.count}/{maxHeadlineLength}
                            </span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 text-lg ${
                                    focusedField === 'headline'
                                        ? 'border-green-400 focus:ring-green-300 bg-green-50/30'
                                        : headlineStats.isOverLimit
                                        ? 'border-red-300 focus:ring-red-300 bg-red-50/30'
                                        : 'border-gray-300 focus:ring-green-300 bg-gray-50 hover:border-gray-400'
                                }`}
                                value={head}
                                onChange={(e) => setHead(e.target.value)}
                                onFocus={() => setFocusedField('headline')}
                                onBlur={() => setFocusedField(null)}
                                onKeyDown={handleKeyDown}
                                placeholder="Masukkan headline yang menarik dan powerful..."
                                maxLength={maxHeadlineLength + 20} // Allow some overflow for warning
                            />
                            {focusedField === 'headline' && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                        {headlineStats.percentage > 80 && (
                            <div className="w-full bg-gray-200 rounded-full h-1">
                                <div 
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        headlineStats.isOverLimit ? 'bg-red-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${Math.min(headlineStats.percentage, 100)}%` }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Subheadline Input */}
                <div className="space-y-4 mb-6">
                    <div className="space-y-2">
                        <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                            <span>Deskripsi/Subheadline</span>
                            <span className={`text-xs ${subheadlineStats.isOverLimit ? 'text-red-500' : 'text-gray-400'}`}>
                                {subheadlineStats.count}/{maxSubheadlineLength}
                            </span>
                        </label>
                        <div className="relative">
                            <textarea
                                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 resize-none ${
                                    focusedField === 'subheadline'
                                        ? 'border-green-400 focus:ring-green-300 bg-green-50/30'
                                        : subheadlineStats.isOverLimit
                                        ? 'border-red-300 focus:ring-red-300 bg-red-50/30'
                                        : 'border-gray-300 focus:ring-green-300 bg-gray-50 hover:border-gray-400'
                                }`}
                                rows={4}
                                value={sub}
                                onChange={(e) => setSub(e.target.value)}
                                onFocus={() => setFocusedField('subheadline')}
                                onBlur={() => setFocusedField(null)}
                                onKeyDown={handleKeyDown}
                                placeholder="Tuliskan deskripsi yang menjelaskan lebih detail tentang produk atau layanan Anda..."
                                maxLength={maxSubheadlineLength + 50} // Allow some overflow for warning
                            />
                            {focusedField === 'subheadline' && (
                                <div className="absolute right-3 top-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                        {subheadlineStats.percentage > 80 && (
                            <div className="w-full bg-gray-200 rounded-full h-1">
                                <div 
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        subheadlineStats.isOverLimit ? 'bg-red-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${Math.min(subheadlineStats.percentage, 100)}%` }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview Section */}
                {showPreview && (head || sub) && (
                    <div className="mb-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border">
                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Preview
                        </h3>
                        <div className="space-y-3">
                            {head && (
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                                    {head}
                                </h1>
                            )}
                            {sub && (
                                <p className="text-gray-600 leading-relaxed">
                                    {sub}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={() => handleSave()}
                        disabled={isSaving || (!hasChanges && !autoSave)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400"
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                {hasChanges ? 'Simpan Perubahan' : 'Tersimpan'}
                            </>
                        )}
                    </Button>

                    {hasChanges && (
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            disabled={isSaving}
                            className="sm:w-auto"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset
                        </Button>
                    )}
                </div>

                {/* Keyboard Shortcuts Info */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600">
                        💡 <strong>Keyboard shortcuts:</strong> Ctrl/Cmd + S untuk simpan, Escape untuk reset
                    </p>
                </div>
            </div>
        </div>
    );
}