"use client";
import { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '@/app/services/api';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getSettings()
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleFavicon = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload/favicon', { method: 'POST', body: form });
    const data = await res.json();
    setSettings({ ...settings, faviconUrl: data.url });
  };

  const handleSave = async () => {
    setSaving(true);
    await updateSettings(settings);
    setSaving(false);
    router.refresh();
  };

  if (loading || !settings) return <div>Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl">Site Settings</h1>
      <div>
        <label className="block text-sm">Site Name</label>
        <input
          name="siteName"
          value={settings.siteName || ''}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label className="block text-sm">Contact Email</label>
        <input
          name="contactEmail"
          value={settings.contactEmail || ''}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label className="block text-sm">Favicon</label>
        {settings.faviconUrl && (
          <img src={settings.faviconUrl} alt="favicon" className="h-8 w-8 mb-2" />
        )}
        <input type="file" onChange={handleFavicon} />
      </div>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white"
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
