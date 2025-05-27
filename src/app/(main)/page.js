import HeroSection from '@/sections/herosection/HeroSection';
import Section2Books from '@/sections/section2book/section2';
import Section3Books from '@/sections/section3book/section3';
import Section4NewsEvent from '@/sections/section4newsevent/Section4NewsEvent';

export default function Home() {
    return (
        <main>
            <HeroSection />
            <Section2Books />
            <Section3Books />
            <Section4NewsEvent />
        </main>
    );
}
