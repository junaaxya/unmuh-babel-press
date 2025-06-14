// src/components/News/NewsCard.js
import {
    faCalendarAlt,
    faClock,
    faUser,
    faArrowRight,
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
            upcoming: {
                text: 'Akan Datang',
                class: 'bg-blue-100 text-blue-800',
            },
            completed: { text: 'Selesai', class: 'bg-gray-100 text-gray-800' },
            ongoing: {
                text: 'Berlangsung',
                class: 'bg-green-100 text-green-800',
            },
        };

        return (
            statusConfig[status] || {
                text: status,
                class: 'bg-gray-100 text-gray-800',
            }
        );
    };

    return (
        <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
            {/* Image Container */}
            <div className="relative overflow-hidden">
                <Image
                    src={item.image}
                    alt={item.title}
                    width={800}
                    height={600}
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = '/unmuhpress.png';
                    }}
                />

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
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

                {/* Status Badge (for events) */}
                {type === 'event' && item.status && (
                    <div className="absolute top-3 right-3">
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                getStatusBadge(item.status).class
                            }`}
                        >
                            {getStatusBadge(item.status).text}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {item.title}
                </h3>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                        <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="w-4 h-4"
                        />
                        <span>{formatDate(item.date)}</span>
                    </div>

                    {type === 'news' && item.readTime && (
                        <div className="flex items-center gap-1">
                            <FontAwesomeIcon
                                icon={faClock}
                                className="w-4 h-4"
                            />
                            <span>{item.readTime}</span>
                        </div>
                    )}

                    {type === 'news' && item.author && (
                        <div className="flex items-center gap-1">
                            <FontAwesomeIcon
                                icon={faUser}
                                className="w-4 h-4"
                            />
                            <span>{item.author}</span>
                        </div>
                    )}

                    {type === 'event' && item.time && (
                        <div className="flex items-center gap-1">
                            <FontAwesomeIcon
                                icon={faClock}
                                className="w-4 h-4"
                            />
                            <span>{item.time}</span>
                        </div>
                    )}
                </div>

                {/* Event Location (for events only) */}
                {type === 'event' && item.location && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                        <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="w-4 h-4"
                        />
                        <span>{item.location}</span>
                    </div>
                )}

                {/* Excerpt */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                    {item.excerpt}
                </p>

                {/* Action Button */}
                <div className="flex justify-between items-center">
                    <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200 group-hover:translate-x-1 transform transition-transform">
                        {type === 'event' && item.status === 'upcoming'
                            ? 'Daftar Sekarang'
                            : 'Baca Selengkapnya'}
                        <FontAwesomeIcon
                            icon={faArrowRight}
                            className="w-4 h-4"
                        />
                    </button>

                    {type === 'event' && item.status === 'upcoming' && (
                        <span className="text-xs text-gray-500">Gratis</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsCard;
