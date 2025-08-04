// src/components/ShareButtons.js
'use client';

import {
  faFacebook,
  faTwitter,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import {
  faShare,
  faCopy,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

// Komponen tombol individual agar lebih rapi
const ShareButton = ({ icon, text, onClick, className, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg transition-colors text-sm ${className}`}
    aria-label={text}
  >
    <FontAwesomeIcon icon={icon} className="w-4 h-4" />
    <span className="font-medium">{text}</span>
    {children}
  </button>
);

const CopyButton = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Gagal menyalin:', e);
      // fallback: seleksi manual
      alert('Salin manual: ' + url);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors text-sm"
      aria-label="Salin Link"
    >
      <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="w-4 h-4" />
      <span className="font-medium">{copied ? 'Tersalin!' : 'Salin Link'}</span>
    </button>
  );
};

export default function ShareButtons({ title, type = 'berita' }) {
  const [currentUrl, setCurrentUrl] = useState('');

  // Pastikan hanya client
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleShare = (platform) => {
    if (!currentUrl) return;

    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(title || '');

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const labelMap = {
    berita: 'Berita',
    event: 'Event',
  };
  const shareLabel = `Bagikan ${labelMap[type] || 'Konten'} Ini`;

  return (
    <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className="text-gray-700 font-semibold flex items-center gap-2">
          <FontAwesomeIcon icon={faShare} />
          {shareLabel}
        </span>
        <div className="flex flex-wrap items-center gap-3">
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
          {currentUrl && <CopyButton url={currentUrl} />}
        </div>
      </div>
    </div>
  );
}
