'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBold,
    faItalic,
    faUnderline,
    faListUl,
    faListOl,
    faQuoteLeft,
    faLink,
    faImage,
    faAlignLeft,
    faAlignCenter,
    faAlignRight,
    faUndo,
    faRedo,
    faTimes,
    faPalette,
    faHighlighter,
    faCode,
    faSpinner,
    faCheckCircle,
    faExclamationTriangle,
    faEye,
} from '@fortawesome/free-solid-svg-icons';

// ==================================================================
// HELPER COMPONENTS
// ==================================================================

const ToolbarButton = ({
    icon,
    onClick,
    title,
    isActive = false,
    disabled = false,
    className = '',
    variant = 'default',
}) => {
    const baseStyles =
        'p-2 rounded-lg transition-all duration-200 flex items-center justify-center';
    const variantStyles = {
        default: `${
            isActive
                ? 'bg-blue-100 text-blue-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
        }`,
        danger: `${
            isActive
                ? 'bg-red-100 text-red-600'
                : 'text-gray-600 hover:bg-red-50'
        }`,
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
        ${className}
      `}
            title={title}
        >
            <FontAwesomeIcon icon={icon} className="w-4 h-4" />
        </button>
    );
};

const ToolbarDivider = () => <div className="w-px h-6 bg-gray-300 mx-2" />;

const LinkModal = ({
    isOpen,
    onClose,
    onSave,
    initialUrl,
    isLoading = false,
}) => {
    const [url, setUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [error, setError] = useState('');
    const urlInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setUrl(initialUrl || '');
            setLinkText('');
            setError('');
            setTimeout(() => urlInputRef.current?.focus(), 100);
        }
    }, [isOpen, initialUrl]);

    const validateUrl = (urlString) => {
        try {
            const url = new URL(
                urlString.startsWith('http')
                    ? urlString
                    : `https://${urlString}`
            );
            return url.href;
        } catch {
            return null;
        }
    };

    const handleSave = () => {
        if (!url.trim()) {
            setError('URL tidak boleh kosong');
            return;
        }

        const validUrl = validateUrl(url);
        if (!validUrl) {
            setError('Format URL tidak valid');
            return;
        }

        setError('');
        onSave(validUrl, linkText.trim());
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        }
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Tambah Link
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 p-1 rounded-md hover:bg-gray-100 transition-colors"
                        disabled={isLoading}
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL Link *
                        </label>
                        <input
                            ref={urlInputRef}
                            type="url"
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                setError('');
                            }}
                            onKeyPress={handleKeyPress}
                            placeholder="https://contoh.com"
                            className={`
                w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                transition-all ${error ? 'border-red-500' : 'border-gray-300'}
              `}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Teks Link (opsional)
                        </label>
                        <input
                            type="text"
                            value={linkText}
                            onChange={(e) => setLinkText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Teks yang akan ditampilkan"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 flex items-center gap-2">
                            <FontAwesomeIcon
                                icon={faExclamationTriangle}
                                className="w-4 h-4"
                            />
                            {error}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-3 p-6 pt-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                        disabled={isLoading}
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading || !url.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {isLoading && (
                            <FontAwesomeIcon
                                icon={faSpinner}
                                className="w-4 h-4 animate-spin"
                            />
                        )}
                        Simpan Link
                    </button>
                </div>
            </div>
        </div>
    );
};

const ColorPicker = ({
    isOpen,
    onClose,
    onColorSelect,
    colors = [],
    title = 'Pilih Warna',
}) => {
    const defaultColors = [
        '#000000',
        '#374151',
        '#6B7280',
        '#9CA3AF',
        '#D1D5DB',
        '#EF4444',
        '#F59E0B',
        '#10B981',
        '#3B82F6',
        '#8B5CF6',
        '#EC4899',
        '#F97316',
        '#84CC16',
        '#06B6D4',
        '#6366F1',
    ];

    const colorOptions = colors.length ? colors : defaultColors;
    const pickerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={pickerRef}
            className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-30 min-w-[200px]"
        >
            <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
            <div className="grid grid-cols-5 gap-2 mb-3">
                {colorOptions.map((color) => (
                    <button
                        key={color}
                        onClick={() => onColorSelect(color)}
                        className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors hover:scale-110"
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                ))}
            </div>
            <button
                onClick={() => onColorSelect(null)}
                className="w-full p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
                Hapus Warna
            </button>
        </div>
    );
};

// ==================================================================
// TOOLBAR COMPONENT
// ==================================================================

const MenuBar = ({
    editor,
    onImageUploadClick,
    isUploading = false,
    onPreview,
}) => {
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [initialLinkUrl, setInitialLinkUrl] = useState('');
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [isHighlightPickerOpen, setIsHighlightPickerOpen] = useState(false);

    const openLinkModal = useCallback(() => {
        const url = editor.getAttributes('link').href || '';
        setInitialLinkUrl(url);
        setIsLinkModalOpen(true);
    }, [editor]);

    const saveLink = useCallback(
        (url, text) => {
            if (url) {
                if (text) {
                    editor
                        .chain()
                        .focus()
                        .insertContent(`<a href="${url}">${text}</a>`)
                        .run();
                } else {
                    editor
                        .chain()
                        .focus()
                        .extendMarkRange('link')
                        .setLink({ href: url })
                        .run();
                }
            } else {
                editor
                    .chain()
                    .focus()
                    .extendMarkRange('link')
                    .unsetLink()
                    .run();
            }
            setIsLinkModalOpen(false);
        },
        [editor]
    );

    const handleColorSelect = useCallback(
        (color) => {
            if (color) {
                editor.chain().focus().setColor(color).run();
            } else {
                editor.chain().focus().unsetColor().run();
            }
            setIsColorPickerOpen(false);
        },
        [editor]
    );

    const handleHighlightSelect = useCallback(
        (color) => {
            if (color) {
                editor.chain().focus().setHighlight({ color }).run();
            } else {
                editor.chain().focus().unsetHighlight().run();
            }
            setIsHighlightPickerOpen(false);
        },
        [editor]
    );

    if (!editor) {
        return (
            <div className="flex items-center justify-center h-16 bg-gray-50 border-b border-gray-200">
                <FontAwesomeIcon
                    icon={faSpinner}
                    className="w-5 h-5 text-gray-400 animate-spin"
                />
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-200 bg-gray-50 sticky top-0 z-20">
                {/* Undo/Redo */}
                <div className="flex items-center gap-1">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        title="Batalkan (Ctrl+Z)"
                        icon={faUndo}
                        disabled={!editor.can().undo()}
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        title="Ulangi (Ctrl+Y)"
                        icon={faRedo}
                        disabled={!editor.can().redo()}
                    />
                </div>

                <ToolbarDivider />

                {/* Heading Levels */}
                <select
                    onChange={(e) => {
                        const level = parseInt(e.target.value);
                        if (level === 0) {
                            editor.chain().focus().setParagraph().run();
                        } else {
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level })
                                .run();
                        }
                    }}
                    value={
                        editor.isActive('heading', { level: 1 })
                            ? 1
                            : editor.isActive('heading', { level: 2 })
                            ? 2
                            : editor.isActive('heading', { level: 3 })
                            ? 3
                            : 0
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value={0}>Paragraf</option>
                    <option value={1}>Judul 1</option>
                    <option value={2}>Judul 2</option>
                    <option value={3}>Judul 3</option>
                </select>

                <ToolbarDivider />

                {/* Text Formatting */}
                <div className="flex items-center gap-1">
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                        isActive={editor.isActive('bold')}
                        title="Tebal (Ctrl+B)"
                        icon={faBold}
                    />
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                        }
                        isActive={editor.isActive('italic')}
                        title="Miring (Ctrl+I)"
                        icon={faItalic}
                    />
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().toggleUnderline().run()
                        }
                        isActive={editor.isActive('underline')}
                        title="Garis Bawah (Ctrl+U)"
                        icon={faUnderline}
                    />
                </div>

                {/* Color Controls */}
                <div className="flex items-center gap-1">
                    <div className="relative">
                        <ToolbarButton
                            onClick={() =>
                                setIsColorPickerOpen(!isColorPickerOpen)
                            }
                            title="Warna Teks"
                            icon={faPalette}
                            isActive={isColorPickerOpen}
                        />
                        <ColorPicker
                            isOpen={isColorPickerOpen}
                            onClose={() => setIsColorPickerOpen(false)}
                            onColorSelect={handleColorSelect}
                            title="Warna Teks"
                        />
                    </div>

                    <div className="relative">
                        <ToolbarButton
                            onClick={() =>
                                setIsHighlightPickerOpen(!isHighlightPickerOpen)
                            }
                            title="Sorotan"
                            icon={faHighlighter}
                            isActive={
                                isHighlightPickerOpen ||
                                editor.isActive('highlight')
                            }
                        />
                        <ColorPicker
                            isOpen={isHighlightPickerOpen}
                            onClose={() => setIsHighlightPickerOpen(false)}
                            onColorSelect={handleHighlightSelect}
                            colors={[
                                '#FEF3C7',
                                '#DBEAFE',
                                '#D1FAE5',
                                '#FCE7F3',
                                '#E0E7FF',
                                '#FED7D7',
                            ]}
                            title="Warna Sorotan"
                        />
                    </div>
                </div>

                <ToolbarDivider />

                {/* Lists */}
                <div className="flex items-center gap-1">
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().toggleBulletList().run()
                        }
                        isActive={editor.isActive('bulletList')}
                        title="Daftar Bullet"
                        icon={faListUl}
                    />
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().toggleOrderedList().run()
                        }
                        isActive={editor.isActive('orderedList')}
                        title="Daftar Angka"
                        icon={faListOl}
                    />
                </div>

                <ToolbarDivider />

                {/* Alignment */}
                <div className="flex items-center gap-1">
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().setTextAlign('left').run()
                        }
                        isActive={editor.isActive({ textAlign: 'left' })}
                        title="Rata Kiri"
                        icon={faAlignLeft}
                    />
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().setTextAlign('center').run()
                        }
                        isActive={editor.isActive({ textAlign: 'center' })}
                        title="Rata Tengah"
                        icon={faAlignCenter}
                    />
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().setTextAlign('right').run()
                        }
                        isActive={editor.isActive({ textAlign: 'right' })}
                        title="Rata Kanan"
                        icon={faAlignRight}
                    />
                </div>

                <ToolbarDivider />

                {/* Special Elements */}
                <div className="flex items-center gap-1">
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().toggleBlockquote().run()
                        }
                        isActive={editor.isActive('blockquote')}
                        title="Kutipan"
                        icon={faQuoteLeft}
                    />
                    <ToolbarButton
                        onClick={() =>
                            editor.chain().focus().toggleCode().run()
                        }
                        isActive={editor.isActive('code')}
                        title="Kode Inline"
                        icon={faCode}
                    />
                    <ToolbarButton
                        onClick={openLinkModal}
                        isActive={editor.isActive('link')}
                        title="Tambah Link"
                        icon={faLink}
                    />
                    <ToolbarButton
                        onClick={onImageUploadClick}
                        title="Tambah Gambar"
                        icon={faImage}
                        disabled={isUploading}
                        className={isUploading ? 'animate-pulse' : ''}
                    />
                </div>

                {/* Preview Button */}
                {onPreview && (
                    <>
                        <ToolbarDivider />
                        <ToolbarButton
                            onClick={onPreview}
                            title="Pratinjau"
                            icon={faEye}
                        />
                    </>
                )}
            </div>

            <LinkModal
                isOpen={isLinkModalOpen}
                onClose={() => setIsLinkModalOpen(false)}
                onSave={saveLink}
                initialUrl={initialLinkUrl}
            />
        </>
    );
};

// ==================================================================
// STATUS DISPLAY COMPONENT
// ==================================================================

const StatusDisplay = ({ status, onDismiss }) => {
    useEffect(() => {
        if (status) {
            const timer = setTimeout(
                onDismiss,
                status.type === 'success' ? 3000 : 5000
            );
            return () => clearTimeout(timer);
        }
    }, [status, onDismiss]);

    if (!status) return null;

    const statusConfig = {
        success: {
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            borderColor: 'border-green-200',
            icon: faCheckCircle,
        },
        error: {
            bgColor: 'bg-red-100',
            textColor: 'text-red-800',
            borderColor: 'border-red-200',
            icon: faExclamationTriangle,
        },
        info: {
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-800',
            borderColor: 'border-blue-200',
            icon: faSpinner,
        },
    };

    const config = statusConfig[status.type] || statusConfig.info;

    return (
        <div
            className={`absolute top-0 left-0 right-0 z-30 p-3 text-sm font-medium flex items-center justify-between ${config.bgColor} ${config.textColor} border-b ${config.borderColor}`}
        >
            <div className="flex items-center gap-2">
                <FontAwesomeIcon
                    icon={config.icon}
                    className={`w-4 h-4 ${
                        status.type === 'info' ? 'animate-spin' : ''
                    }`}
                />
                {status.message}
            </div>
            <button
                onClick={onDismiss}
                className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
            >
                <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
            </button>
        </div>
    );
};

// ==================================================================
// MAIN EDITOR COMPONENT
// ==================================================================

export default function Editor({
    content = '',
    onChange,
    placeholder = 'Mulai menulis konten Anda...',
    className = '',
    disabled = false,
    onImageUpload, // <-- Prop ini sekarang menjadi kunci utama
    onPreview,
    height = '400px',
    maxLength,
}) {
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState(null);
   const [wordCount, setWordCount] = useState(0);
    const fileInputRef = useRef(null);

    const editor = useEditor(
        {
            extensions: [
                TextStyle,
                Color,
                Highlight.configure({ multicolor: true }),
                StarterKit.configure({
                    heading: { levels: [1, 2, 3] },
                    codeBlock: false,
                }),
                Underline,
                Image.configure({
                    HTMLAttributes: {
                        class: 'max-w-full h-auto rounded-lg shadow-sm my-4',
                    },
                }),
                Link.configure({
                    openOnClick: false,
                    autolink: true,
                    HTMLAttributes: {
                        class: 'text-blue-600 hover:text-blue-800 underline',
                    },
                }),
                Placeholder.configure({ placeholder }),
                TextAlign.configure({ types: ['heading', 'paragraph'] }),
            ],
            content: content || '',
            editable: !disabled,
            immediatelyRender: false,

            onUpdate: ({ editor }) => {
                const html = editor.getHTML();
            // *** PERBAIKAN: Pastikan 'text' didefinisikan sebelum digunakan ***
            const text = editor.getText(); 
            setWordCount(text.length);
            onChange?.(html, text.length);
            },
            editorProps: {
                attributes: {
                    class: `prose prose-sm sm:prose-base max-w-none focus:outline-none p-4`,
                    style: `min-height: ${height}; max-height: 600px; overflow-y: auto;`,
                },
                handleDrop: (view, event, slice, moved) => {
                    const files = Array.from(event.dataTransfer?.files || []);
                    const imageFiles = files.filter((file) =>
                        file.type.startsWith('image/')
                    );
                    if (imageFiles.length > 0) {
                        event.preventDefault();
                        imageFiles.forEach((file) =>
                            handleImageUpload({ target: { files: [file] } })
                        );
                        return true;
                    }
                    return false;
                },
            },
        },
        [disabled, height]
    );

    useEffect(() => {
        if (editor && content !== undefined && editor.getHTML() !== content) {
            editor.commands.setContent(content, false);
            setWordCount(editor.getText().length);
        }
    }, [editor, content]);

    const handleImageUpload = useCallback(
        async (event) => {
            // Pastikan ada fungsi onImageUpload yang diberikan dari parent
            if (!onImageUpload) {
                console.error("Editor: prop 'onImageUpload' tidak disediakan.");
                setStatus({
                    type: 'error',
                    message: 'Fungsi upload tidak dikonfigurasi.',
                });
                return;
            }

            const file = event.target.files?.[0];
            if (!file) return;

            // Validasi sederhana (bisa diperkuat jika perlu)
            if (!file.type.startsWith('image/')) {
                setStatus({
                    type: 'error',
                    message: 'File yang dipilih bukan gambar.',
                });
                return;
            }

            setIsUploading(true);
            setStatus({ type: 'info', message: 'Mengunggah gambar...' });

            try {
                // Panggil fungsi upload dari parent dan tunggu URL-nya
                const imageUrl = await onImageUpload(file);

                if (imageUrl && typeof imageUrl === 'string') {
                    editor
                        ?.chain()
                        .focus()
                        .setImage({ src: imageUrl, alt: file.name })
                        .run();
                    setStatus({
                        type: 'success',
                        message: 'Gambar berhasil diunggah!',
                    });
                } else {
                    throw new Error(
                        'URL gambar tidak valid diterima dari uploader.'
                    );
                }
            } catch (error) {
                console.error('Error uploading image in editor:', error);
                setStatus({
                    type: 'error',
                    message: error.message || 'Gagal mengunggah gambar.',
                });
            } finally {
                setIsUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        },
        [editor, onImageUpload]
    );

    const clearStatus = useCallback(() => setStatus(null), []);

    if (!editor) {
        return (
            <div
                className={`border border-gray-300 rounded-lg overflow-hidden bg-white ${className}`}
            >
                <div className="flex items-center justify-center h-32">
                    <FontAwesomeIcon
                        icon={faSpinner}
                        className="w-8 h-8 text-gray-400 animate-spin"
                    />
                    <span className="ml-3 text-gray-500">Memuat editor...</span>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`border border-gray-300 rounded-lg overflow-hidden relative bg-white ${className}`}
        >
            {/* Status Display */}
            <StatusDisplay status={status} onDismiss={clearStatus} />

            {/* Loading Overlay */}
            {isUploading && (
                <div className="absolute inset-0 bg-white bg-opacity-90 z-20 flex items-center justify-center">
                    <div className="text-center p-6">
                        <FontAwesomeIcon
                            icon={faSpinner}
                            className="w-8 h-8 text-blue-600 animate-spin mb-3"
                        />
                        <p className="text-lg font-semibold text-gray-700">
                            Mengunggah gambar...
                        </p>
                        <p className="text-sm text-gray-500">
                            Mohon tunggu sebentar.
                        </p>
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <MenuBar
                editor={editor}
                onImageUploadClick={() => fileInputRef.current?.click()}
                isUploading={isUploading}
                onPreview={onPreview}
            />

            {/* Editor Content */}
            <div className="relative">
                <EditorContent editor={editor} />

                {/* Word Count */}
                <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm">
                    {wordCount} karakter
                    {maxLength && ` / ${maxLength}`}
                    {maxLength && wordCount > maxLength && (
                        <span className="text-red-500 ml-1">
                            Melebihi batas!
                        </span>
                    )}
                </div>
            </div>

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                disabled={disabled}
            />

            {/* Custom Styles */}
        </div>
    );
}
