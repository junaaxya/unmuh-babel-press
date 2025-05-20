'use client';
import SectionHeading from '@/components/common/SectionHeading';
import { NewsList, NewsLoading, NewsEmpty } from '@/components/News';
import { dummyNewBook } from '@/data/dummyNewBook';

export default function Section4NewsEvent() {
    const newsData = dummyNews;
    const isLoading = false;

    if (isLoading) return <NewsLoading />;
    if (!newsData.length) return <NewsEmpty />;
    return (
        <section className="py-16 bg-gray-50">
            <SectionHeading title="Update Berita & Event" />
            <NewsList items={dummyNewBook} />
        </section>
    );
}
