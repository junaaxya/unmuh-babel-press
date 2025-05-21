import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar/Navbar';
import Footer from './../sections/footer/Footer';

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
        images: ['https://unmuhbabelpress.com/unmuhpress.ong'],
    },
    icons: {
        icon: '/favicon32.png', 
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="id">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Navbar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
