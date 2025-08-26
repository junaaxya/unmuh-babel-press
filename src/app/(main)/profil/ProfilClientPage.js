'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
    faHistory,
    faEye,
    faUsers,
    faPhone,
    faCogs,
    faGraduationCap,
    faBookOpen,
    faTabletAlt,
    faUserEdit,
} from '@fortawesome/free-solid-svg-icons';

import ProfileHero from '@/components/common/ProfileHero';
import ProfileSection from '@/components/common/ProfileSection';
import ProfileCard from '@/components/common/ProfileCard';
import TabNavigation from '@/components/common/TabNavigation';
import ContactInfo from '@/components/common/ContactInfo';
import Timeline from '@/components/ui/Timeline';

export default function ProfilClientPage({ data }) {
    const [activeTab, setActiveTab] = useState('sejarah');
    const { hero, visionMission, history, team, services, contact } = data || {};

    const tabs = [
        { id: 'sejarah', label: 'Sejarah' },
        { id: 'visi-misi', label: 'Visi & Misi' },
        { id: 'struktur', label: 'Tim Kami' },
        { id: 'layanan', label: 'Layanan' },
        { id: 'kontak', label: 'Kontak' },
    ];

    const serviceIconMap = {
        'Penerbitan Buku Akademik': faGraduationCap,
        'Penerbitan Umum': faBookOpen,
        'Digital Publishing': faTabletAlt,
        'Self Publishing': faUserEdit,
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'sejarah':
                return (
                    <ProfileSection
                        title="Sejarah Unmuh Babel Press"
                        subtitle="Perjalanan kami dalam mengembangkan dunia penerbitan akademik dan umum"
                        icon={faHistory}
                    >
                        <Timeline items={history || []} />
                    </ProfileSection>
                );
            case 'visi-misi':
                return (
                    <ProfileSection
                        title="Visi & Misi"
                        subtitle="Landasan dan arah pengembangan Unmuh Babel Press"
                        icon={faEye}
                    >
                        <ProfileSection.VisionMission data={visionMission} />
                    </ProfileSection>
                );
            case 'struktur':
                return (
                    <ProfileSection
                        title="Tim Kami"
                        subtitle="Para profesional yang berdedikasi dalam pengembangan penerbitan berkualitas"
                        icon={faUsers}
                    >
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {(team || []).map((member, index) => (
                                <ProfileCard
                                    key={index}
                                    title={member.name}
                                    description={member.description}
                                    image={member.image}
                                    variant="team"
                                    className="text-center"
                                />
                            ))}
                        </div>
                    </ProfileSection>
                );
            case 'layanan':
                return (
                    <ProfileSection
                        title="Layanan Kami"
                        subtitle="Berbagai layanan penerbitan profesional untuk memenuhi kebutuhan Anda"
                        icon={faCogs}
                    >
                        <div className="grid md:grid-cols-2 gap-8">
                            {(services || []).map((service, index) => (
                                <ProfileCard
                                    key={index}
                                    title={service.title}
                                    description={service.description}
                                    icon={serviceIconMap[service.title]}
                                    features={service.features?.map(f => f.text) || []}
                                    variant="service"
                                />
                            ))}
                        </div>
                    </ProfileSection>
                );
            case 'kontak':
                return (
                    <ProfileSection
                        title="Hubungi Kami"
                        subtitle="Dapatkan informasi lebih lanjut atau konsultasikan kebutuhan penerbitan Anda"
                        icon={faPhone}
                    >
                        <ContactInfo data={contact} />
                    </ProfileSection>
                );
            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <ProfileHero data={hero} />
            <div className="bg-white dark:bg-gray-900 sticky top-0 z-40 shadow-sm">
                <div className="container mx-auto px-4">
                    <TabNavigation
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900">
                {renderTabContent()}
            </div>
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Siap Menerbitkan Karya Anda?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Bergabunglah dengan ratusan penulis yang telah
                            mempercayakan karya mereka kepada kami
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="https://wa.me/6282171222017?text=Halo%20saya%20ingin%20konsultasi%20gratis%20terkait%20layanan%20Anda"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-block"
                            >
                                Konsultasi Gratis
                            </a>
                            <Link
                                href="/catalog"
                                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
                            >
                                Lihat Katalog
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
