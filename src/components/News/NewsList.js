import NewsCard from './NewsCard';

export default function NewsList({ items }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {items.map((news) => (
                <NewsCard key={news.id} {...news} />
            ))}
        </div>
    );
}
