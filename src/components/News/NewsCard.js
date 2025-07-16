// src/components/News/NewsCard.js
import Link from 'next/link';
import {
    faCalendarDays,
    faClock,
    faMapMarkerAlt,
    faUser,
    faTag,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

const NewsCard = ({ item, type = 'news' }) => {
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Jakarta',
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            Upcoming: 'bg-green-100 text-green-800',
            Completed: 'bg-gray-100 text-gray-800',
            Ongoing: 'bg-blue-100 text-blue-800',
        };

        return statusConfig[status] || 'bg-gray-100 text-gray-800';
    };

    if (!item) return null;

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            {/* Image Container */}
            <div className="relative overflow-hidden">
                <Image
                    src={item.image || '/unmuhpress.png'}
                    alt={item.title}
                    width={800}
                    height={600}
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = '/unmuhpress.png';
                    }}
                />
                <div className="absolute top-4 left-4">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            type === 'event'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                        }`}
                    >
                        {item.category}
                    </span>
                </div>
                {type === 'event' && item.status && (
                    <div className="absolute top-4 right-4">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                                item.status
                            )}`}
                        >
                            {item.status}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                </h3>

                {/* Meta Information */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                            icon={faCalendarDays}
                            className="w-4 h-4 text-blue-500"
                        />
                        <span>{formatDate(item.date)}</span>
                    </div>

                    {type === 'event' && item.time && (
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon
                                icon={faClock}
                                className="w-4 h-4 text-green-500"
                            />
                            <span>{item.time}</span>
                        </div>
                    )}

                    {type === 'event' && item.location && (
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon
                                icon={faMapMarkerAlt}
                                className="w-4 h-4 text-red-500"
                            />
                            <span>{item.location}</span>
                        </div>
                    )}

                    {type === 'news' && item.author && (
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon
                                icon={faUser}
                                className="w-4 h-4 text-purple-500"
                            />
                            <span>{item.author}</span>
                        </div>
                    )}
                </div>

                {/* Excerpt */}
                <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                </p>

                {/* Organizer for Events */}
                {type === 'event' && item.organizer && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                        <FontAwesomeIcon
                            icon={faTag}
                            className="w-4 h-4 text-orange-500"
                        />
                        <span className="font-medium">
                            Penyelenggara: {item.organizer}
                        </span>
                    </div>
                )}

                {/* Read More Button */}
                <Link
                    // href={`/${type === 'event' ? 'event' : 'berita'}/${item.slug}`}
                    href={`/`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
                >
                    {type === 'event' ? 'Lihat Detail' : 'Baca Selengkapnya'}
                    <svg
                        className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default NewsCard;
