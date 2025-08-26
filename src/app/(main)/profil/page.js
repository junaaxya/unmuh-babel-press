import ProfilePageClient from './ProfilePageClient';

export const revalidate = 60;

const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function fetchSection(section) {
  try {
    const res = await fetch(`${baseUrl}/api/profile/${section}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (e) {
    console.error(`Failed to fetch profile section ${section}`, e);
    return null;
  }
}

export default async function ProfilPage() {
  const [hero, history] = await Promise.all([
    fetchSection('hero'),
    fetchSection('history'),
  ]);

  const data = {
    hero,
    history,
    visionMission: null,
    team: [],
    services: [],
    contact: null,
  };

  return <ProfilePageClient data={data} />;
}
