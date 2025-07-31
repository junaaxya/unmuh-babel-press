'use client';

import { useState } from 'react';

export default function ClientImage({ src, alt, className }) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc('/placeholder.jpg')}
    />
  );
}
