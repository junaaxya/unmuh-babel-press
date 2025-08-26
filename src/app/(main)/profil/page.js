import ProfilClientPage from './ProfilClientPage';

const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function fetchSection(path) {
    const res = await fetch(`${base}${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    const json = await res.json();
    return json.data;
}

async function fetchBookAndAuthorStats() {
    const limit = 100;
    let page = 1;
    let allAuthors = new Set();
    let totalBooks = 0;
    while (true) {
        const res = await fetch(`${base}/api/books?limit=${limit}&page=${page}`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) break;
        const json = await res.json();
        totalBooks = json.meta?.total || 0;
        (json.data || []).forEach((b) => {
            if (b.penulis) allAuthors.add(b.penulis);
        });
        if (page >= (json.meta?.total_pages || 1)) break;
        page++;
    }
    return { books: totalBooks, authors: allAuthors.size };
}

export default async function Page() {
    const [hero, visionMission, history, team, services, contact, stats] = await Promise.all([
        fetchSection('/api/profile/hero'),
        fetchSection('/api/profile/vision-mission'),
        fetchSection('/api/profile/history'),
        fetchSection('/api/profile/team'),
        fetchSection('/api/profile/services'),
        fetchSection('/api/profile/contact'),
        fetchBookAndAuthorStats(),
    ]);

    hero.stats = [
        { number: stats.books, label: 'Buku Diterbitkan', suffix: '+', icon: 'fa-book' },
        { number: stats.authors, label: 'Penulis Tergabung', suffix: '+', icon: 'fa-users' },
    ];

    const data = { hero, visionMission, history, team, services, contact };
    return <ProfilClientPage data={data} />;
}
