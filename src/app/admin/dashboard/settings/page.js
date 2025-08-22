'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getSettings, updateSettings } from '@/app/services/api';
import FaviconUploader from './FaviconUploader';

export default function SettingsPage() {
  const { data: session } = useSession();
  const role = session?.user?.role ?? 'VIEWER';
  const canEdit = role === 'ADMIN' || role === 'EDITOR';

  const [tab, setTab] = useState('general');
  const [settings, setSettings] = useState({ siteName: '', faviconUrl: '', sessionMaxAgeHours: 24 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getSettings();
        setSettings({
          siteName: data.siteName || '',
          faviconUrl: data.faviconUrl || '',
          sessionMaxAgeHours: data.sessionMaxAgeHours ?? 24,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!canEdit) return;
    setSaving(true);
    setErrors({});
    setMessage('');
    try {
      const payload = {
        siteName: settings.siteName.trim(),
        sessionMaxAgeHours: parseInt(settings.sessionMaxAgeHours, 10),
      };
      if (settings.faviconUrl) {
        payload.faviconUrl = settings.faviconUrl;
      }
      await updateSettings(payload);
    } catch (err) {
      setErrors(err.fieldErrors || {});
      setMessage(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading settings…</div>;

  return (
    <main className="p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1>
          Settings { !canEdit && <span className="ml-2 text-sm">(Read-only)</span> }
        </h1>
        {canEdit && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white"
          >
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        )}
      </header>
      {message && <p className="text-red-500 text-sm">{message}</p>}

      <nav className="flex space-x-2 border-b">
        {['general', 'security'].map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-3 py-2 ${tab === key ? 'border-b-2 border-blue-600' : ''}`}
          >
            {key === 'general' ? 'General' : 'Security'}
          </button>
        ))}
      </nav>

      {tab === 'general' && (
        <section className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm mb-1">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              readOnly={!canEdit}
              className="border p-2"
            />
            {errors.siteName && (
              <p className="text-red-500 text-sm">{errors.siteName[0]}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-sm mb-1">Favicon</label>
            <FaviconUploader
              value={settings.faviconUrl}
              onChange={(url) => handleChange('faviconUrl', url)}
            />
            {errors.faviconUrl && (
              <p className="text-red-500 text-sm">{errors.faviconUrl[0]}</p>
            )}
          </div>
        </section>
      )}

      {tab === 'security' && (
        <section className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm mb-1">Session Max Age (hours)</label>
            <input
              type="number"
              min="1"
              max="720"
              value={settings.sessionMaxAgeHours}
              onChange={(e) => handleChange('sessionMaxAgeHours', e.target.value)}
              readOnly={!canEdit}
              className="border p-2"
            />
            {errors.sessionMaxAgeHours && (
              <p className="text-red-500 text-sm">
                {errors.sessionMaxAgeHours[0]}
              </p>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
