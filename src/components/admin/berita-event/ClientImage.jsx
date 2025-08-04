'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ClientImage({ src, alt, className }) {
  const [imgSrc, setImgSrc] = useState(src);

  

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      width={300} height={192}
      onError={() => setImgSrc('/placeholder.jpg')}
    />
  );
}
