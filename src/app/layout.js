import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { getSiteSettings } from '@/lib/settings';
import { MyThemeProvider } from '../components/common/ThemeProvider';

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
        <html lang="id" suppressHydrationWarning>
            <head>
                <link rel="icon" href={settings.faviconUrl || '/favicon.ico'} />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <MyThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    {children}
                </MyThemeProvider>
            </body>
        </html>
    );
}
