import KontakClientPage from './KontakClientPage';

const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default async function KontakPage() {
  try {
    const res = await fetch(`${base}/api/profile/contact`, { next: { revalidate: 3600 } });
    const json = res.ok ? await res.json() : { data: null };
    return <KontakClientPage contact={json.data} />;
  } catch (e) {
    console.error(e);
    return <div className="p-8 text-center">Terjadi kesalahan saat memuat kontak.</div>;
  }
}

