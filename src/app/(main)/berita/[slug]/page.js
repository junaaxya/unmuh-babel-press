// src/app/(main)/berita/[slug]/page.js
import { notFound } from 'next/navigation';
import newsData from '@/data/news';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarAlt,
    faUser,
    faTag,
    faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import ClientImage from '@/components/admin/berita-event/ClientImage';
// Impor komponen baru
import ShareButtons from '@/components/ShareButtons/ShareButtons';

export async function generateStaticParams() {
    return newsData.map((news) => ({
        slug: news.slug,
    }));
}

export default async function BeritaDetailPage({ params }) {
    const { slug } = params;

    const news = newsData.find((item) => item.slug === slug);

    if (!news) notFound();

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
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
                    {/* Featured Image */}
                    <div className="aspect-video bg-gray-200">
                        <ClientImage
                            src={news.image}
                            alt={news.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Article Content */}
                    <div className="p-8">
                        <div
                            className="ProseMirror"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />
                    </div>

                    {/* Share Section - Ganti bagian ini */}
                    <ShareButtons title={news.title} />
                </div>

                {/* Related News */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Berita Terkait
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {newsData
                            .filter(
                                (item) =>
                                    item.id !== news.id &&
                                    item.category === news.category
                            )
                            .slice(0, 2)
                            .map((relatedNews) => (
                                <Link
                                    key={relatedNews.id}
                                    href={`/berita/${relatedNews.slug}`}
                                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <div className="aspect-video bg-gray-200">
                                        <ClientImage
                                            src={relatedNews.image}
                                            alt={relatedNews.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            {relatedNews.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-2">
                                            {relatedNews.excerpt}
                                        </p>
                                        <div className="text-xs text-gray-500">
                                            {formatDate(relatedNews.date)}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
