import { useState } from 'react';
import Button from '@/components/ui/button/Button';
import { updateHeroText } from '@/app/services/api';

export default function HeroTextEditor({ headline, subheadline, onSuccess, setNotification }) {
  const [head, setHead] = useState(headline);
  const [sub, setSub] = useState(subheadline);

  const handleSave = async () => {
    try {
      await updateHeroText({ headline: head, subheadline: sub });
      setNotification({ type: 'success', message: 'Teks berhasil disimpan.' });
      onSuccess();
    } catch {
      setNotification({ type: 'error', message: 'Gagal menyimpan teks.' });
    }
  };

  return (
    <div className="p-4 border rounded space-y-4">
      <h2 className="text-lg font-semibold">Hero Text</h2>
      <input
        type="text"
        className="w-full border p-2"
        value={head}
        onChange={e => setHead(e.target.value)}
        placeholder="Headline"
      />
      <textarea
        className="w-full border p-2"
        rows={3}
        value={sub}
        onChange={e => setSub(e.target.value)}
        placeholder="Subheadline"
      />
      <Button onClick={handleSave}>Simpan</Button>
    </div>
  );
}
