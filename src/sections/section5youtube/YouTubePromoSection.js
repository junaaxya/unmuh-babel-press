// src/sections/YouTubePromoSection.js
'use client';

import React, { useState } from 'react';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

// Import komponen UI yang sudah dibuat
import Button from '@/components/ui/button/Button';
import Card, { VideoCard } from '@/components/ui/card/card';
import Title from '@/components/ui/title/Title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Konfigurasi YouTube Channel
const YOUTUBE_CONFIG = {
  channelUrl: 'https://youtube.com/@unmuhbabelpress', // Ganti dengan URL channel sebenarnya
  channelName: 'Unmuh Babel Press',
  subscriberCount: '12.5K',
  videoCount: '156'
};

// Data video YouTube (contoh - nantinya bisa dari API)
const FEATURED_VIDEOS = [
  {
    id: 'video1',
    title: 'Peluncuran Buku Terbaru: Sejarah Pendidikan Islam di Babel',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=480&h=270&fit=crop',
    duration: '15:32',
    channel: 'Unmuh Babel Press',
    views: '2.1K views',
    uploadTime: '2 days ago',
    videoUrl: 'https://youtube.com/watch?v=example1'
  },
  {
    id: 'video2',
    title: 'Diskusi Buku: Metodologi Penelitian Pendidikan Modern',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=480&h=270&fit=crop',
    duration: '23:45',
    channel: 'Unmuh Babel Press',
    views: '1.8K views',
    uploadTime: '1 week ago',
    videoUrl: 'https://youtube.com/watch?v=example2'
  },
  {
    id: 'video3',
    title: 'Workshop Penulisan Ilmiah untuk Dosen Muda',
    thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=480&h=270&fit=crop',
    duration: '18:20',
    channel: 'Unmuh Babel Press',
    views: '956 views',
    uploadTime: '2 weeks ago',
    videoUrl: 'https://youtube.com/watch?v=example3'
  },
  {
    id: 'video4',
    title: '[LIVE] Seminar Nasional Publikasi Ilmiah 2024',
    thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=480&h=270&fit=crop',
    duration: 'LIVE',
    channel: 'Unmuh Babel Press',
    views: '435 watching',
    uploadTime: 'LIVE',
    videoUrl: 'https://youtube.com/watch?v=example4'
  }
];

const YouTubePromoSection = () => {
  const [isChannelHovered, setIsChannelHovered] = useState(false);

  const handleChannelClick = () => {
    window.open(YOUTUBE_CONFIG.channelUrl, '_blank', 'noopener,noreferrer');
  };

  const handleVideoPlay = (video) => {
    window.open(video.videoUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title level={2} className="text-blue-800 mb-4 text-center">
            Channel YouTube Kami
          </Title>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Temukan konten edukatif, diskusi buku, workshop, dan seminar terbaru dari Unmuh Babel Press
          </p>
        </div>

        {/* Channel Info Card */}
        <div className="mb-12 flex justify-center">
          <Card 
            variant="glass" 
            className="max-w-md cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={handleChannelClick}
            onMouseEnter={() => setIsChannelHovered(true)}
            onMouseLeave={() => setIsChannelHovered(false)}
          >
            <div className="text-center">
              {/* YouTube Icon */}
              <div className="mb-6 relative">
                <FontAwesomeIcon
                  icon={faYoutube}
                  className={`text-red-600 transition-all duration-300 ${
                    isChannelHovered ? 'text-red-500 scale-110' : ''
                  }`}
                  size="6x"
                />
                {isChannelHovered && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faPlay}
                      className="text-white text-2xl animate-pulse"
                    />
                  </div>
                )}
              </div>

              {/* Channel Stats */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {YOUTUBE_CONFIG.channelName}
              </h3>
              <div className="flex justify-center space-x-6 text-sm text-gray-600 mb-6">
                <div className="text-center">
                  <div className="font-semibold text-lg text-blue-600">
                    {YOUTUBE_CONFIG.subscriberCount}
                  </div>
                  <div>Subscribers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-green-600">
                    {YOUTUBE_CONFIG.videoCount}
                  </div>
                  <div>Videos</div>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faYoutube} className="mr-2" />
                Subscribe & Watch
              </Button>
            </div>
          </Card>
        </div>

        {/* Featured Videos Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Video Terbaru & Populer
          </h3>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {FEATURED_VIDEOS.map((video) => (
            <VideoCard
              key={video.id}
              title={video.title}
              thumbnail={video.thumbnail}
              duration={video.duration}
              channel={video.channel}
              views={video.views}
              uploadTime={video.uploadTime}
              onPlay={() => handleVideoPlay(video)}
              className="transform transition-all duration-300 hover:scale-105"
            />
          ))}
        </div>

        {/* Additional CTA Section */}
        <div className="mt-12 text-center">
          <Card variant="neon" className="max-w-2xl mx-auto">
            <div className="text-center">
              <h4 className="text-xl font-bold text-white mb-3">
                Jangan Lewatkan Update Terbaru!
              </h4>
              <p className="text-gray-300 mb-6">
                Subscribe channel YouTube kami untuk mendapatkan notifikasi video terbaru tentang dunia pendidikan dan penerbitan
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  onClick={handleChannelClick}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold"
                >
                  <FontAwesomeIcon icon={faYoutube} className="mr-2" />
                  Kunjungi Channel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default YouTubePromoSection;