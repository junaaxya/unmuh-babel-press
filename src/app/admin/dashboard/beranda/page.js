'use client';
import React, { useEffect, useState } from 'react';
import LogoUploader from './components/LogoUploader';
import HeroImageUploader from './components/HeroImageUploader';
import HeroTextEditor from './components/HeroTextEditor';
// import Notification from '@/components/ui/Notification';
import { getHomeContent } from '../../../services/api';

export default function BerandaPage() {
    const [data, setData] = useState(null);
    useEffect(() => {
        setData({
            logoUrl: '/unmuhpress.png',
            heroImageUrl: '/unmuhpress.png',
            headline: 'Selamat Datang!',
            subheadline: 'Ini adalah subheadline contoh',
        });
    }, []);
    const [notification, setNotification] = useState(null);

    const fetchData = async () => {
        const res = await getHomeContent();
        setData(res);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">Kelola Halaman Beranda</h1>

            {notification && <Notification {...notification} />}

            {data && (
                <>
                    <LogoUploader
                        logoUrl={data.logoUrl}
                        onSuccess={fetchData}
                        setNotification={setNotification}
                    />
                    <HeroImageUploader
                        imageUrl={data.heroImageUrl}
                        onSuccess={fetchData}
                        setNotification={setNotification}
                    />
                    <HeroTextEditor
                        headline={data.headline}
                        subheadline={data.subheadline}
                        onSuccess={fetchData}
                        setNotification={setNotification}
                    />
                </>
            )}
        </div>
    );
}
