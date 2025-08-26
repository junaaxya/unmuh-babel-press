import ProfilClientPage from './ProfilClientPage';

async function fetchSection(path) {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${base}${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    const json = await res.json();
    return json.data;
}

export default async function Page() {
    const [hero, visionMission, history, team, services, contact] = await Promise.all([
        fetchSection('/api/profile/hero'),
        fetchSection('/api/profile/vision-mission'),
        fetchSection('/api/profile/history'),
        fetchSection('/api/profile/team'),
        fetchSection('/api/profile/services'),
        fetchSection('/api/profile/contact'),
    ]);

    const data = { hero, visionMission, history, team, services, contact };
    return <ProfilClientPage data={data} />;
}
