// src/components/ui/Title.js
'use client';

import React from 'react';

const Title = ({ children, level = 2, className = '', ...props }) => {
  const Tag = `h${level}`;
  const baseStyle = 'font-bold';
  
  const sizeStyles = {
    1: 'text-4xl md:text-5xl',
    2: 'text-2xl md:text-3xl', // Sesuai gambar "Unmuh Babel Press"
    3: 'text-xl md:text-2xl',
    4: 'text-lg md:text-xl',
  };

  return (
    <Tag className={`${baseStyle} ${sizeStyles[level]} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export default Title;