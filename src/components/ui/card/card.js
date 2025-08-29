// src/components/ui/Card.js
'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const Card = ({
    children,
    className = '',
    variant = 'default',
    hover = true,
    loading = false,
    onClick,
    ...props
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const baseClasses = `
    relative overflow-hidden transition-all duration-300 ease-out
    ${hover ? 'transform-gpu cursor-pointer' : ''}
  `;

    const variantClasses = {
        default: `
      bg-white rounded-xl shadow-lg border border-gray-100
      ${hover ? 'hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]' : ''}
    `,
        video: `
      bg-gradient-to-br from-gray-900 via-gray-800 to-black 
      rounded-2xl shadow-2xl border border-gray-700
      ${
          hover
              ? 'hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] hover:-translate-y-3 hover:scale-[1.03]'
              : ''
      }
    `,
        glass: `
      bg-white/10 backdrop-blur-xl rounded-2xl 
      shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
      border border-white/20
      ${
          hover
              ? 'hover:bg-white/20 hover:shadow-[0_25px_50px_-12px_rgba(31,38,135,0.5)] hover:-translate-y-2'
              : ''
      }
    `,
        neon: `
      bg-gray-900 rounded-2xl shadow-2xl
      border-2 border-transparent bg-clip-border
      ${
          hover
              ? 'hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:-translate-y-2'
              : ''
      }
    `,
    };

    const contentClasses = {
        default: 'p-6',
        video: 'p-0',
        glass: 'p-6',
        neon: 'p-6 bg-gray-900 rounded-2xl m-[2px]',
    };

    return (
        <div
            className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${className}
      `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            {...props}
        >
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 rounded-inherit">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                        <div
                            className="w-3 h-3 bg-white rounded-full animate-bounce"
                            style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                            className="w-3 h-3 bg-white rounded-full animate-bounce"
                            style={{ animationDelay: '0.2s' }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Shimmer Effect for Hover */}
            {hover && isHovered && (
                <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-12 translate-x-full animate-shimmer pointer-events-none"></div>
            )}

            {/* Content Container */}
            <div className={contentClasses[variant]}>{children}</div>

            {/* Decorative Elements */}
            {variant === 'video' && (
                <>
                    {/* Corner Gradient */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/20 to-transparent pointer-events-none"></div>

                    {/* Bottom Gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                </>
            )}
        </div>
    );
};

// Specialized Video Card Component
export const VideoCard = ({
    title,
    thumbnail,
    duration,
    channel,
    views,
    uploadTime,
    onPlay,
    className = '',
    ...props
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
        setIsPlaying(true);
        if (onPlay) onPlay();
    };

    return (
        <Card
            variant="video"
            className={`group max-w-sm ${className}`}
            onClick={handlePlay}
            {...props}
        >
            {/* Thumbnail Container */}
            <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                {/* Thumbnail Image */}
                <Image
                    src={thumbnail}
                    alt={title}
                    width={500}
                    height={400}
                    className={`
            w-full h-full object-cover transition-all duration-500
            ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}
            group-hover:scale-110
          `}
                    onLoad={() => setImageLoaded(true)}
                />

                {/* Image Loading Skeleton */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse"></div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-red-600 rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                        <svg
                            className="w-8 h-8 text-white ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>

                {/* Duration Badge */}
                {duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                        {duration}
                    </div>
                )}

                {/* Live Badge */}
                {uploadTime === 'LIVE' && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                        🔴 LIVE
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <h3 className="text-white font-semibold text-sm line-clamp-2 leading-tight group-hover:text-red-400 transition-colors duration-300">
                    {title}
                </h3>

                {/* Channel Info */}
                <div className="flex items-center space-x-2 text-gray-400 text-xs">
                    <span className="hover:text-white transition-colors duration-200 cursor-pointer">
                        {channel}
                    </span>
                    <span>•</span>
                    <span>{views}</span>
                    {uploadTime !== 'LIVE' && (
                        <>
                            <span>•</span>
                            <span>{uploadTime}</span>
                        </>
                    )}
                </div>

                {/* Progress Bar (if playing) */}
                {isPlaying && (
                    <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
                        <div
                            className="bg-red-600 h-1 rounded-full animate-pulse"
                            style={{ width: '30%' }}
                        ></div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default Card;
