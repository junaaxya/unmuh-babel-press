import { useState, useEffect, useRef, useCallback } from 'react';
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
    autoSaveDelay = 2000,
}) {
    const [head, setHead] = useState(headline || '');
    const [sub, setSub] = useState(subheadline || '');
    const [isSaving, setIsSaving] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const autoSaveTimeoutRef = useRef(null);
    const initialValuesRef = useRef({ head: headline || '', sub: subheadline || '' });

    useEffect(() => {
        setHead(headline || '');
        setSub(subheadline || '');
        initialValuesRef.current = { head: headline || '', sub: subheadline || '' };
    }, [headline, subheadline]);

    const hasChanges = head !== initialValuesRef.current.head || sub !== initialValuesRef.current.sub;

    const sanitize = (text) => text.replace(/<[^>]*>?/gm, '').trim();

    const handleSave = useCallback(
        async (silent = false) => {
            if (!hasChanges && !silent) {
                setNotification({
                    type: 'info',
                    message: 'Tidak ada perubahan untuk disimpan.',
                });
                return;
            }

            const sanitizedHead = sanitize(head);
            const sanitizedSub = sanitize(sub);

            if (!sanitizedHead || !sanitizedSub) {
                setNotification({
                    type: 'error',
                    message: 'Headline dan subheadline tidak boleh kosong.',
                });
                return;
            }

            if (
                sanitizedHead.length > maxHeadlineLength ||
                sanitizedSub.length > maxSubheadlineLength
            ) {
                setNotification({
                    type: 'error',
                    message: 'Input melebihi batas panjang yang diizinkan.',
                });
                return;
            }

            setIsSaving(true);
            try {
                const res = await updateHeroText({ title: sanitizedHead, subtitle: sanitizedSub });

                const saved = res?.herotext || { title: sanitizedHead, subtitle: sanitizedSub };
                setHead(saved.title);
                setSub(saved.subtitle);

                if (!silent) {
                    setNotification({
                        type: 'success',
                        message: 'Teks hero berhasil disimpan!',
                    });
                }

                initialValuesRef.current = {
                    head: saved.title,
                    sub: saved.subtitle,
                };

                onSuccess();
            } catch (error) {
                setNotification({
                    type: 'error',
                    message:
                        error?.message || 'Gagal menyimpan teks hero. Silakan coba lagi.',
                });
            } finally {
                setIsSaving(false);
            }
        },
        [head, sub, hasChanges, maxHeadlineLength, maxSubheadlineLength, onSuccess, setNotification]
    );

    useEffect(() => {
        if (!autoSave || !hasChanges) return;

        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }

        autoSaveTimeoutRef.current = setTimeout(() => {
            handleSave(true);
        }, autoSaveDelay);

        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [head, sub, autoSave, autoSaveDelay, handleSave, hasChanges]);

    const handleReset = async () => {
        const { head: resetHeadline, sub: resetSubheadline } = initialValuesRef.current;

        setHead(resetHeadline);
        setSub(resetSubheadline);
        setIsSaving(true);

        try {
            await updateHeroText({
                title: resetHeadline,
                subtitle: resetSubheadline,
            });

            setNotification({
                id: Date.now(),
                type: 'success',
                message: 'Teks berhasil di-reset ke versi awal!',
            });

            onSuccess();
        } catch (error) {
            setNotification({
                id: Date.now(),
                type: 'error',
                message: error?.message || 'Gagal mengirim data reset ke server.',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            handleSave();
        }
        if (e.key === 'Escape') {
            handleReset();
        }
    };

    const getCharacterCount = (text, max) => {
        const count = text.length;
        const remaining = Math.max(0, max - count);
        const isOverLimit = count > max;

        return {
            count,
            remaining,
            isOverLimit,
            percentage: (count / max) * 100,
        };
    };

    const headlineStats = getCharacterCount(head, maxHeadlineLength);
    const subheadlineStats = getCharacterCount(sub, maxSubheadlineLength);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave();
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
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

            <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4 mb-6">
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                        <span>Headline Utama</span>
                        <span className={`text-xs ${headlineStats.isOverLimit ? 'text-red-500' : 'text-gray-400'}`}>
                            {headlineStats.count}/{maxHeadlineLength}
                        </span>
                    </label>
                    <textarea
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 text-lg resize-none ${
                            focusedField === 'headline'
                                ? 'border-green-400 focus:ring-green-300 bg-green-50/30'
                                : headlineStats.isOverLimit
                                ? 'border-red-300 focus:ring-red-300 bg-red-50/30'
                                : 'border-gray-300 focus:ring-green-300 bg-gray-50 hover:border-gray-400'
                        }`}
                        rows={2}
                        value={head}
                        onChange={(e) => setHead(e.target.value)}
                        onFocus={() => setFocusedField('headline')}
                        onBlur={() => setFocusedField(null)}
                        onKeyDown={handleKeyDown}
                        placeholder="Gunakan enter untuk pindah baris"
                        maxLength={maxHeadlineLength + 20}
                    />
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

                <div className="space-y-4 mb-6">
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                        <span>Subheadline</span>
                        <span className={`text-xs ${subheadlineStats.isOverLimit ? 'text-red-500' : 'text-gray-400'}`}>
                            {subheadlineStats.count}/{maxSubheadlineLength}
                        </span>
                    </label>
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
                        placeholder="Tuliskan deskripsi singkat tentang hero section Anda..."
                        maxLength={maxSubheadlineLength + 50}
                    />
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
                                    {head.split('\n').map((line, idx) => (
                                        <span key={idx}>
                                            {line}
                                            <br />
                                        </span>
                                    ))}
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

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        type="submit"
                        disabled={isSaving || !hasChanges}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400"
                    >
                        {isSaving ? 'Menyimpan...' : hasChanges ? 'Simpan Perubahan' : 'Tersimpan'}
                    </Button>

                    {hasChanges && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            disabled={isSaving}
                            className="sm:w-auto"
                        >
                            Reset
                        </Button>
                    )}
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600">
                        💡 <strong>Shortcut:</strong> Ctrl/Cmd + S untuk simpan, Escape untuk reset
                    </p>
                </div>
            </form>
        </div>
    );
}
