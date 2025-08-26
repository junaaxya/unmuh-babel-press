import ProfilClientPage from './ProfilClientPage';

const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function fetchSection(path) {
    try {
        const res = await fetch(`${base}${path}`, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error(`Failed to fetch ${path}`);
        const json = await res.json();
        return json.data;
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function fetchBookAndAuthorStats() {
    try {
        const limit = 100;
        let page = 1;
        const allAuthors = new Set();
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
    } catch (e) {
        console.error(e);
        return { books: 0, authors: 0 };
    }
}

export default async function Page() {
    try {
        const [hero, visionMission, history, team, services, contact, stats] = await Promise.all([
            fetchSection('/api/profile/hero'),
            fetchSection('/api/profile/vision-mission'),
            fetchSection('/api/profile/history'),
            fetchSection('/api/profile/team'),
            fetchSection('/api/profile/services'),
            fetchSection('/api/profile/contact'),
            fetchBookAndAuthorStats(),
        ]);

        const heroWithStats = {
            ...(hero || {}),
            stats: [
                { number: stats?.books ?? 0, label: 'Buku Diterbitkan', suffix: '+', icon: 'fa-book' },
                { number: stats?.authors ?? 0, label: 'Penulis Tergabung', suffix: '+', icon: 'fa-users' },
            ],
        };

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
        return <div className="p-8 text-center">Terjadi kesalahan saat memuat profil.</div>;
    }
}
