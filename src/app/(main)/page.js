import HeroSection from '@/sections/herosection/HeroSection';
import Section2Books from '@/sections/section2book/section2';
import dynamic from 'next/dynamic';

const Section3Books = dynamic(() => import('@/sections/section3book/section3'));
const Section4NewsEvent = dynamic(
    () => import('@/sections/section4newsevent/Section4NewsEvent')
);
const YouTubePromoSection = dynamic(
    () => import('@/sections/section5youtube/YouTubePromoSection')
);

export default function Home() {
    return (
        <main>
            <HeroSection />
            <Section2Books />
            <Section3Books />
            <Section4NewsEvent />
            <YouTubePromoSection />
        </main>
    );
}
