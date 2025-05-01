// 📁 src/components/book/BookCard.js
import Image from 'next/image';

const BookCard = ({ title, subtitle, image }) => {
    return (
        <div className="w-[200px] sm:w-[240px] bg-blue-50 rounded-2xl shadow-md p-4 flex flex-col justify-between hover:scale-105 transition-transform">
            <div className="w-full h-[160px] bg-white rounded-lg mb-4 overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
                {title}
            </div>
            <div className="text-xs text-gray-600 line-clamp-1">{subtitle}</div>
        </div>
    );
};

export default BookCard;
