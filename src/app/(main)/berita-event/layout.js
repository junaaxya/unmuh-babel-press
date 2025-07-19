export const metadata = {
  title: 'Berita & Event | Unmuh Babel Press',
  description:
    'Ikuti kabar terbaru dan acara menarik dari Unmuh Babel Press. Dapatkan informasi terpercaya seputar publikasi, seminar, peluncuran buku, dan aktivitas literasi lainnya.',
  keywords: [
    'berita Unmuh Babel Press',
    'event kampus Unmuh Babel',
    'acara penerbitan buku',
    'seminar literasi',
    'publikasi ilmiah',
    'Unmuh Bangka Belitung',
  ],
  openGraph: {
    title: 'Berita & Event | Unmuh Babel Press',
    description:
      'Ikuti kabar terbaru dan acara menarik dari Unmuh Babel Press. Dapatkan informasi terpercaya seputar publikasi, seminar, peluncuran buku, dan aktivitas literasi lainnya.',
    url: 'https://unmuhbabelpress.com/berita-event',
    type: 'website',
    siteName: 'Unmuh Babel Press',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Berita & Event | Unmuh Babel Press',
    description:
      'Dapatkan update terkini mengenai acara dan berita dari Unmuh Babel Press.',
  },
  alternates: {
    canonical: 'https://unmuhbabelpress.com/berita-event',
  },
};



export default function BeritaEventLayout({ children }) {
    return <>{children}</>;
}