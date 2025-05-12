import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@/components/ui/button/Button';
import { motion } from 'framer-motion';
import Image from 'next/image';


export default function NewsCard({ title, date, description, image, link }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow p-4 flex flex-col transition hover:shadow-lg"
        >
            <Image
                src={image}
                alt={title}
                width={400}
                height={250}
                className="w-full h-48 object-cover rounded-lg mb-4"
                priority
            />
            <div className="flex items-center text-sm text-gray-500 mb-2">
                <FontAwesomeIcon
                    icon={faCalendarDays}
                    style={{ color: '#808080' }}
                    className="mr-2"
                />
                {new Date(date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })}
            </div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">{description}</p>
            <a href={link}>
                <Button>Baca Selengkapnya</Button>
            </a>
        </motion.article>
    );
}
