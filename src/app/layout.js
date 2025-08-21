
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { getSiteSettings } from '@/lib/settings';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata = {
    title: 'Unmuh Babel Press - Penerbit Buku Digital Muhammadiyah Babel',
    description: 'Unmuh Babel Press adalah platform penerbitan buku digital resmi Universitas Muhammadiyah Babel.',
    keywords: 'buku, penerbitan, digital, universitas muhammadiyah bangka belitung, unmuhpress',
    authors: [{ name: 'Unmuh Press Team', url: 'https://unmuhbabelpress.com' }],
    openGraph: {
        title: 'Unmuh Babel Press - Penerbit Buku Digital Muhammadiyah Babel',
        description: 'Platform penerbitan buku digital resmi Universitas Muhammadiyah Babel.',
        url: 'https://unmuhbabelpress.com',
        siteName: 'Unmuh Press',
        images: [
            {
                url: 'https://unmuhbabelpress.com/unmuhpress.png',
                width: 1200,
                height: 630,
                alt: 'Unmuh Press Logo',
            },
        ],
        locale: 'id_ID',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Unmuh Press - Penerbit Buku Digital Muhammadiyah Babel',
        description: 'Platform penerbitan buku digital resmi Universitas Muhammadiyah Babel.',
        images: ['https://unmuhbabelpress.com/unmuhpress.png'],
    },
    icons: {
        icon: '/favicon.ico',
    },
};

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const settings = await getSiteSettings();
    return {
        title: settings.defaultTitle || 'Unmuh Babel Press',
        description: settings.defaultDescription || 'Unmuh Babel Press',
        openGraph: {
            title: settings.defaultTitle || 'Unmuh Babel Press',
            description: settings.defaultDescription || 'Unmuh Babel Press',
            images: settings.ogImageUrl ? [settings.ogImageUrl] : undefined,
        },
        icons: {
            icon: settings.faviconUrl || '/favicon.ico',
        },
    };
}

export default async function RootLayout({ children }) {
    const settings = await getSiteSettings();
    return (
        <html lang="id">
            <head>
                <link rel="icon" href={settings.faviconUrl || '/favicon.ico'} />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <main>{children}</main>
            </body>
        </html>
    );
}
