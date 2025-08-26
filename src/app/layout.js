import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { getSiteSettings } from '@/lib/settings';
import { MyThemeProvider } from '../components/common/ThemeProvider';
import { GoogleAnalytics } from '@next/third-parties/google';

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
        title: settings.siteName || 'Unmuh Babel Press',
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
                {process.env.NEXT_PUBLIC_GA_ID && (
                    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
                )}
            </body>
        </html>
    );
}
