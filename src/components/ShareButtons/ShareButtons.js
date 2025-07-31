// src/components/ShareButtons.js
'use client';

import {
    faFacebook,
    faTwitter,
    faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

// Komponen tombol individual agar lebih rapi
const ShareButton = ({ icon, text, onClick, className }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${className}`}
    >
        <FontAwesomeIcon icon={icon} className="w-4 h-4" />
        <span className="font-medium">{text}</span>
    </button>
);

export default function ShareButtons({ title }) {
    const [currentUrl, setCurrentUrl] = useState('');

    // Kita menggunakan useEffect untuk memastikan window.location.href hanya diakses di sisi client
    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, []);

    const handleShare = (platform) => {
        if (!currentUrl) return;

        // Encode judul dan URL agar aman digunakan di dalam link
        const encodedUrl = encodeURIComponent(currentUrl);
        const encodedTitle = encodeURIComponent(title);
        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
                break;
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`;
                break;
            default:
                return;
        }

        // Buka link share di tab baru
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className="text-gray-700 font-semibold flex items-center gap-2">
                    <FontAwesomeIcon icon={faShare} />
                    Bagikan Berita Ini
                </span>
                <div className="flex items-center space-x-3">
                    <ShareButton
                        icon={faFacebook}
                        text="Facebook"
                        onClick={() => handleShare('facebook')}
                        className="bg-blue-600 hover:bg-blue-700"
                    />
                    <ShareButton
                        icon={faTwitter}
                        text="Twitter"
                        onClick={() => handleShare('twitter')}
                        className="bg-sky-500 hover:bg-sky-600"
                    />
                    <ShareButton
                        icon={faWhatsapp}
                        text="WhatsApp"
                        onClick={() => handleShare('whatsapp')}
                        className="bg-green-600 hover:bg-green-700"
                    />
                </div>
            </div>
        </div>
    );
}