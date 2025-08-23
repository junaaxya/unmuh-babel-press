'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/button/Button';
import { faBookOpen, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { getHomeContent } from '@/app/services/api';

export default function HeroSection() {
    const [heroImage, setHeroImage] = useState('/unmuhpress.png');
    const [headline, setHeadline] = useState('');
    const [subheadline, setSubheadline] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getHomeContent();
                if (data.heroImageUrl) setHeroImage(data.heroImageUrl);
                if (data.headline) setHeadline(data.headline);
                if (data.subheadline) setSubheadline(data.subheadline);
            } catch (error) {
                console.error('Gagal memuat data hero section:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="bg-gray-900 py-16 px-6 md:px-20">
            <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
                {/* Left: Text */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-lg md:text-5xl font-bold text-blue-900 dark:text-white leading-tight">
                        {headline ? (
                            headline.split('\n').map((line, i) => (
                                <span key={i}>
                                    {line}
                                    {i === 0 && (
                                        <br className="hidden md:block" />
                                    )}
                                </span>
                            ))
                        ) : (
                            <>
                                Penerbitan Ilmiah
                                <br className="hidden md:block" /> di
                                Universitas Muhammadiyah Bangka Belitung
                            </>
                        )}
                    </h1>
                    <p className="mt-2 md:mt-4 text-gray-600 dark:text-gray-300 text-[8px] md:text-base">
                        {subheadline ||
                            'Menyediakan layanan publikasi, penerbitan buku, dan penyebarluasan ilmu pengetahuan untuk dosen dan mahasiswa.'}
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link
                            href="/catalog"
                            className="flex flex-col text-center"
                        >
                            <Button icon={faBookOpen} variant="primary">
                                Lihat Katalog
                            </Button>
                        </Link>
                        <Link
                            href="/kontak"
                            className="flex flex-col text-center"
                        >
                            <Button icon={faEnvelope} variant="outline">
                                Hubungi Kami
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Right: Image */}
                <div className="flex-1 flex justify-center">
                    {isLoading ? (
                        <div className="w-[500px] h-[400px] bg-gray-200 animate-pulse rounded-xl" />
                    ) : (
                        <Image
                            src={heroImage}
                            alt="Ilustrasi Penerbitan"
                            width={500}
                            height={400}
                            priority
                            className="object-contain"
                            onError={() => setHeroImage('/unmuhpress.png')}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
