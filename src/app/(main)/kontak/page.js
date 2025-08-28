import KontakClientPage from './KontakClientPage';

export const revalidate = 0;

const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default async function KontakPage() {
  try {
    const res = await fetch(`${base}/api/profile/contact`, { cache: 'no-store' });
    const json = res.ok ? await res.json() : { data: null };
    return <KontakClientPage contact={json.data} />;
  } catch (e) {
    console.error(e);
    return <div className="p-8 text-center">Terjadi kesalahan saat memuat kontak.</div>;
  }
}

