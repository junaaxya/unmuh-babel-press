'use client';
import React, { useEffect, useState } from 'react';
import LogoUploader from './components/LogoUploader';
import HeroImageUploader from './components/HeroImageUploader';
import HeroTextEditor from './components/HeroTextEditor';
import { getHomeContent } from '../../../services/api';
import Notification from '@/components/ui/Notification/Notification';

export default function BerandaPage() {
    const [data, setData] = useState(null);
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

            {notification && (
  <Notification
    key={notification.id}
    {...notification}
    onClose={() => setNotification(null)}
  />
)}


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
