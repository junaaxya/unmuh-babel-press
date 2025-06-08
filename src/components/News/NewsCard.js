'use client';

import {
    faCalendarDays,
    faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@/components/ui/button/Button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function NewsCard({
    title,
    date,
    description,
    image,
    link,
    category = 'Berita',
}) {
    const truncatedDescription =
        description.length > 120
            ? `${description.substring(0, 120)}...`
            : description;

    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl p-5 flex flex-col h-full transition-all duration-300"
        >
            <div className="relative aspect-video w-full mb-4 overflow-hidden rounded-lg">
                <Image
                    src={image}
                    alt={title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    priority
                />
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded">
                    {category}
                </span>
            </div>

            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                <FontAwesomeIcon
                    icon={faCalendarDays}
                    className="mr-2 text-blue-600 dark:text-blue-400"
                    size="sm"
                />
                {new Date(date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })}
            </div>

            <h3 className="font-bold text-xl mb-3 line-clamp-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                {title}
            </h3>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                {truncatedDescription}
            </p>

            <Link href={link} className="mt-auto">
                <Button className="w-full flex items-center justify-center gap-2 group">
                    <span className="text-gray-900 dark:text-white">
                        Baca Selengkapnya
                    </span>
                    <FontAwesomeIcon
                        icon={faArrowRight}
                        className="transform transition-transform duration-300 group-hover:translate-x-1 text-blue-600 dark:text-blue-400"
                    />
                </Button>
            </Link>
        </motion.article>
    );
}
