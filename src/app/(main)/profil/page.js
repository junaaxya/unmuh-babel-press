import { notFound } from 'next/navigation';
import ProfilClientPage from './ProfilClientPage';

export const revalidate = 0;

const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function fetchSection(path) {
    const res = await fetch(`${base}${path}`, { cache: 'no-store' });
    if (!res.ok) return null;
    try {
        const json = await res.json();
        return json.data;
    } catch {
        return null;
    }
}

export default async function Page() {
    try {
        const [hero, visionMission, history, team, services, contactRaw, statistics] = await Promise.all([
            fetchSection('/api/profile/hero'),
            fetchSection('/api/profile/vision-mission'),
            fetchSection('/api/profile/history'),
            fetchSection('/api/profile/team'),
            fetchSection('/api/profile/services'),
            fetchSection('/api/profile/contact'),
            fetchSection('/api/statistics'),
        ]);

        if (!hero) return notFound();

        const heroWithStats = {
            ...hero,
            stats: [
                { number: statistics?.books ?? 0, label: 'Buku Diterbitkan', suffix: '+', icon: 'fa-book' },
                { number: statistics?.authors ?? 0, label: 'Penulis Tergabung', suffix: '+', icon: 'fa-users' },
                { number: statistics?.events ?? 0, label: 'Available Events', suffix: '', icon: 'fa-calendar' },
                { number: statistics?.news ?? 0, label: 'Latest News', suffix: '', icon: 'fa-newspaper' },
            ],
        };

        const contact = contactRaw
            ? {
                  address: {
                      street: contactRaw.addressStreet,
                      city: contactRaw.addressCity,
                      province: contactRaw.addressProvince,
                      postal: contactRaw.addressPostal,
                  },
                  phone: {
                      number: contactRaw.phoneNumber,
                      whatsapp: contactRaw.phoneWhatsapp,
                  },
                  email: {
                      general: contactRaw.emailGeneral,
                      submission: contactRaw.emailSubmission,
                  },
                  social: contactRaw.socialLinks || [],
                  hours: {
                      weekdays: contactRaw.hoursWeekdays,
                      weekend: contactRaw.hoursWeekend,
                      closed: contactRaw.hoursClosed,
                  },
              }
            : null;

        const data = {
            hero: heroWithStats,
            visionMission,
            history,
            team,
            services,
            contact,
        };

        return <ProfilClientPage data={data} />;
    } catch (e) {
        console.error(e);
        return notFound();
    }
}
