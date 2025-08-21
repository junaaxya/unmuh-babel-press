
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

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    const settings = await getSiteSettings();
    return {
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
