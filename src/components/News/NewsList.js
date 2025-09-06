// src/components/News/NewsList.js
import NewsCard from './NewsCard';

export default function NewsList({ items }) {
    if (!Array.isArray(items)) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
                <NewsCard
                    key={`${item.type}-${item.id}`} // Gunakan key yang lebih unik
                    item={item}
                    type={item.type || 'news'}
                />
            ))}
        </div>
    );
}