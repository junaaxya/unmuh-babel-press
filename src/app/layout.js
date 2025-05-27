import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'UNMUH BABEL PRESS - Penerbit Buku Digital Muhammadiyah Babel',
  description:
    'Unmuh Babel Press adalah platform penerbitan buku digital resmi Universitas Muhammadiyah Babel.',
  keywords:
    'buku, penerbitan, digital, universitas muhammadiyah bangka belitung, unmuhpress, UNMUH BABEL PRESS, babelpress, unmuh press, babel press',
  authors: [{ name: 'Unmuh Press Team', url: 'https://unmuhbabelpress.com' }],
  openGraph: {
    title: 'UNMUH BABEL PRESS - Penerbit Buku Digital Muhammadiyah Babel',
    description:
      'Platform penerbitan buku digital resmi Universitas Muhammadiyah Babel.',
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
    title: 'UNMUH BABEL PRESS - Penerbit Buku Digital Muhammadiyah Babel',
    description:
      'Platform penerbitan buku digital resmi Universitas Muhammadiyah Babel.',
    images: ['https://unmuhbabelpress.com/unmuhpress.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },

};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}