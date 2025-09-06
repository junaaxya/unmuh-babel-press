// src/sections/YouTubePromoSection.js
'use client';

import React, { useState, useEffect } from 'react';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import Button from '@/components/ui/button/Button';
import Card, { VideoCard } from '@/components/ui/card/card';
import Title from '@/components/ui/title/Title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const YouTubePromoSection = () => {
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isChannelHovered, setIsChannelHovered] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/youtube/promo');
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        setChannel(data.channel);
        setVideos(data.videos || []);
      } catch (err) {
        console.error('Failed to load YouTube data', err);
        setError('Gagal memuat data YouTube.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChannelClick = () => {
    if (channel?.url) {
      window.open(channel.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleVideoPlay = (video) => {
    if (video?.url) {
      window.open(video.url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en', { notation: 'compact' }).format(num || 0);
  };

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const diff = Date.now() - new Date(dateStr).getTime();
    const units = [
      { limit: 60 * 1000, divisor: 1000, unit: 'second' },
      { limit: 60 * 60 * 1000, divisor: 60 * 1000, unit: 'minute' },
      { limit: 24 * 60 * 60 * 1000, divisor: 60 * 60 * 1000, unit: 'hour' },
      { limit: 30 * 24 * 60 * 60 * 1000, divisor: 24 * 60 * 60 * 1000, unit: 'day' },
      { limit: 365 * 24 * 60 * 60 * 1000, divisor: 30 * 24 * 60 * 60 * 1000, unit: 'month' },
      { limit: Infinity, divisor: 365 * 24 * 60 * 60 * 1000, unit: 'year' },
    ];
    for (const { limit, divisor, unit } of units) {
      if (diff < limit) {
        const value = Math.floor(diff / divisor);
        return rtf.format(-value, unit);
      }
    }
    return '';
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <Title level={2} className="text-blue-800 mb-4 text-center">
            Channel YouTube Kami
          </Title>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Temukan konten edukatif, diskusi buku, workshop, dan seminar terbaru dari Unmuh Babel Press
          </p>
        </div>

        <div className="mb-12 flex justify-center">
          {loading ? (
            <Card variant="glass" className="max-w-md" loading />
          ) : error ? (
            <Card variant="glass" className="max-w-md">
              <div className="p-6 text-center text-red-600">{error}</div>
            </Card>
          ) : (
            <Card
              variant="glass"
              className="max-w-md cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={handleChannelClick}
              onMouseEnter={() => setIsChannelHovered(true)}
              onMouseLeave={() => setIsChannelHovered(false)}
            >
              <div className="text-center">
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

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {channel?.title || ''}
                </h3>
                <div className="flex justify-center space-x-6 text-sm text-gray-600 mb-6">
                  <div className="text-center">
                    <div className="font-semibold text-lg text-blue-600">
                      {formatNumber(channel?.subscriberCount)}
                    </div>
                    <div>Subscribers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg text-green-600">
                      {formatNumber(channel?.videoCount)}
                    </div>
                    <div>Videos</div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FontAwesomeIcon icon={faYoutube} className="mr-2" />
                  Subscribe & Watch
                </Button>
              </div>
            </Card>
          )}
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Video Terbaru & Populer
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {loading ? (
            <p className="col-span-full text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="col-span-full text-center text-red-600">{error}</p>
          ) : (
            videos.map((video) => (
              <VideoCard
                key={video.id}
                title={video.title}
                thumbnail={video.thumbnailUrl}
                duration={video.duration}
                channel={channel?.title || ''}
                views={
                  video.isLive
                    ? `${formatNumber(video.viewCount)} watching`
                    : `${formatNumber(video.viewCount)} views`
                }
                uploadTime={video.isLive ? 'LIVE' : formatRelativeTime(video.publishedAt)}
                onPlay={() => handleVideoPlay(video)}
                className="transform transition-all duration-300 hover:scale-105"
              />
            ))
          )}
        </div>

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
