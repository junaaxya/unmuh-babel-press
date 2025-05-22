'use client';

import Image from 'next/image';
import Button from '@/components/ui/button/Button';
import { faBookOpen, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="bg-blue-50 dark:bg-gray-900 py-16 px-6 md:px-20">
            <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
                {/* Left: Text */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-lg md:text-5xl font-bold text-blue-900 dark:text-white leading-tight">
                        Penerbitan Ilmiah <br className="hidden md:block" /> di
                        Universitas Muhammadiyah Bangka Belitung
                    </h1>
                    <p className="mt-2 md:mt-4 text-gray-600 dark:text-gray-300 text-[8px] md:text-base">
                        Menyediakan layanan publikasi, penerbitan buku, dan
                        penyebarluasan ilmu pengetahuan untuk dosen dan
                        mahasiswa.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link href="/catalog">
                            <Button icon={faBookOpen} variant="primary">
                                Lihat Katalog
                            </Button>
                        </Link>
                        <Button icon={faEnvelope} variant="outline">
                            Hubungi Kami
                        </Button>
                    </div>
                </div>

                {/* Right: Image */}
                <div className="flex-1 flex justify-center">
                    <Image
                        src="/unmuhpress.png"
                        alt="Ilustrasi Penerbitan"
                        width={500}
                        height={400}
                        priority
                    />
                </div>
            </div>
        </section>
    );
}
