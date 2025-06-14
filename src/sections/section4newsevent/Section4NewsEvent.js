'use client';
import SectionHeading from '@/components/common/SectionHeading';
import { NewsList, NewsLoading, NewsEmpty } from '@/components/News';
import { dummyNews } from '@/data/dummyNews';

export default function Section4NewsEvent() {
    const newsData = dummyNews;
    const isLoading = false;

    if (isLoading) return <NewsLoading />;
    if (!newsData.length) return <NewsEmpty />;
    return (
        <section className="py-16 bg-gray-50">
            <SectionHeading title="Update Berita & Event" />
            <NewsList items={dummyNews} />
        </section>
    );
}
