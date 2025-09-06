// src/app/(main)/berita/[slug]/page.js
import { notFound } from 'next/navigation';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarAlt,
    faUser,
    faTag,
    faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image'
import ShareButtons from '@/components/ShareButtons/ShareButtons';
import { getNews,getNewsBySlug } from '@/app/services/api';

// Fungsi ini mengambil data utama dan data terkait dari API
async function getNewsData(slug) {
    try {
        const newsResponse = await getNewsBySlug(slug);
        const news = newsResponse.data;

        // Jika berita tidak ada ATAU statusnya bukan 'published', anggap tidak ditemukan.
        if (!news || news.status !== 'published') {
            return { news: null, relatedNews: [] };
        }

        // Ambil berita terkait yang juga sudah 'published'
        const relatedNewsResponse = await getNews({
            category: news.category,
            limit: 3,
            status: 'published', // Filter berita terkait
        });
        
        const relatedNews = relatedNewsResponse.data.items
            .filter((item) => item.slug !== slug)
            .slice(0, 2);

        return { news, relatedNews };
    } catch (error) {
        console.error(`Gagal mengambil data untuk slug: ${slug}`, error);
        return { news: null, relatedNews: [] };
    }
}

// Fungsi ini membuat halaman statis untuk setiap berita saat build
export async function generateStaticParams() {
    try {
        // Ambil semua berita yang statusnya 'published'
        const response = await getNews({ limit: 1000, status: 'published' });
        if (!response.data || !response.data.items) {
            return [];
        }
        return response.data.items.map((news) => ({
            slug: news.slug,
        }));
    } catch (error) {
        console.error("Gagal membuat parameter statis untuk berita:", error);
        return [];
    }
}

export default async function BeritaDetailPage({ params }) {
    const { slug } = await params;
    const { news, relatedNews } = await getNewsData(slug);

    // Jika data berita tidak ditemukan, tampilkan halaman 404
    if (!news) {
        notFound();
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <Link
                        href="/berita-event"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Kembali ke Berita & Event
                    </Link>

                    <div className="space-y-2">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            {news.category}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                            {news.title}
                        </h1>
                        <p className="text-xl text-gray-600">{news.excerpt}</p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center text-gray-600">
                            <FontAwesomeIcon
                                icon={faCalendarAlt}
                                className="mr-2"
                            />
                            <span>{formatDate(news.date)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                            <span>{news.author}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <FontAwesomeIcon icon={faTag} className="mr-2" />
                            <span>{news.category}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                     {news.image && (
                        <div className="relative aspect-video bg-gray-200">
                            <Image
                                src={news.image}
                                alt={news.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                priority // Prioritaskan gambar utama untuk dimuat
                            />
                        </div>
                    )}

                    {/* Article Content */}
                    <div className="p-8">
                        <div
                            className="ProseMirror max-w-none"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />
                    </div>

                    {/* Share Section - Ganti bagian ini */}
                    <ShareButtons title={news.title} type="berita" />
                </div>

                {/* Related News */}
                {relatedNews.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Berita Terkait</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {relatedNews.map((relatedNewsItem) => (
                                <Link key={relatedNewsItem.id} href={`/berita/${relatedNewsItem.slug}`} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                                    {relatedNewsItem.image && (
                                        <div className="relative aspect-video bg-gray-200 overflow-hidden">
                                            <Image
                                                src={relatedNewsItem.image}
                                                alt={relatedNewsItem.title}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                className="group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{relatedNewsItem.title}</h3>
                                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{relatedNewsItem.excerpt}</p>
                                        <div className="text-xs text-gray-500">{formatDate(relatedNewsItem.date)}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
