import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { getSiteSettings } from '@/lib/settings';
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const revalidate = 3600;

// --- OPTIMASI SEO DIMULAI DI SINI ---
export async function generateMetadata() {
    const settings = await getSiteSettings();

    const siteName = settings.siteName || 'Unmuh Babel Press';
    const siteDescription =
        settings.siteDescription ||
        'Penerbit dan publikasi resmi Universitas Muhammadiyah Bangka Belitung. Menghadirkan karya ilmiah, buku, dan jurnal berkualitas.';
    const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || 'https://unmuhbabelpress.com';
    const ogImageUrl = settings.ogImageUrl || `${siteUrl}/unmuhpress.png`; // Gambar default untuk social media

    return {
        // Metadata Dasar
        title: {
            default: siteName,
            template: `%s | ${siteName}`, // Judul dinamis untuk halaman lain, misal: "Tentang Kami | Unmuh Babel Press"
        },
        description: siteDescription,
        keywords: [
            'Unmuh Babel',
            'Penerbit Universitas',
            'Jurnal Ilmiah',
            'Buku Akademik',
            'Bangka Belitung',
            'Universitas muhammadiyah bangka belitung',
            'muhammadiyah',
            'unmuh',
            'unmuh babel press',
            'babel press',
        ],
        authors: [{ name: 'Unmuh Babel Press', url: siteUrl }],
        creator: 'Unmuh Babel Press',
        publisher: 'Unmuh Babel Press',

        // Metadata untuk Mesin Pencari
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
        metadataBase: new URL(siteUrl), // Penting untuk URL absolut
        alternates: {
            canonical: '/', // URL canonical untuk halaman utama
        },

        // Metadata untuk Social Media (Open Graph & Twitter)
        openGraph: {
            title: siteName,
            description: siteDescription,
            url: siteUrl,
            siteName: siteName,
            images: [
                {
                    url: ogImageUrl, // Harus URL absolut
                    width: 1200,
                    height: 630,
                    alt: `Logo ${siteName}`,
                },
            ],
            locale: 'id_ID',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: siteName,
            description: siteDescription,
            images: [ogImageUrl], // Harus URL absolut
        },

        // Metadata Lainnya
        icons: {
            icon: settings.faviconUrl || '/favicon.ico',
        },
    };
}

export default async function RootLayout({ children }) {
    const settings = await getSiteSettings();

    // Data untuk JSON-LD
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: settings.siteName || 'Unmuh Babel Press',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://unmuhbabelpress.com',
        logo:
            settings.logoUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+62-821-7122-2017',
            contactType: 'customer service',
        },
    };

    return (
        <html lang="id" suppressHydrationWarning>
            <body>
                {/* Menambahkan JSON-LD ke dalam <head> */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData),
                    }}
                />

                {children}

                {process.env.NEXT_PUBLIC_GA_ID && (
                    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
                )}
            </body>
        </html>
    );
}
