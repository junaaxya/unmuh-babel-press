"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getSettings, updateSettings, uploadFavicon } from '@/app/services/api';

const tabs = [
  { key: 'general', label: 'Umum' },
  { key: 'seo', label: 'SEO & Media Sosial' },
  { key: 'security', label: 'Keamanan' },
  { key: 'technical', label: 'Teknis' },
];

const fields = {
  general: ['siteName', 'contactEmail', 'faviconUrl', 'logoUrl'],
  seo: ['defaultTitle', 'defaultDescription', 'ogImageUrl', 'facebook', 'instagram', 'twitter', 'ga4MeasurementId', 'metaPixelId'],
  security: ['require2FA', 'passwordMinLength', 'sessionMaxAgeHours'],
  technical: ['smtpHost', 'smtpPort', 'smtpUser', 'smtpPass', 'fromName', 'fromEmail', 'revalidateSeconds'],
};

const labels = {
  siteName: 'Site Name',
  contactEmail: 'Contact Email',
  faviconUrl: 'Favicon',
  logoUrl: 'Logo URL',
  defaultTitle: 'Default Title',
  defaultDescription: 'Default Description',
  ogImageUrl: 'OG Image URL',
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'Twitter',
  ga4MeasurementId: 'GA4 Measurement ID',
  metaPixelId: 'Meta Pixel ID',
  require2FA: 'Require 2FA',
  passwordMinLength: 'Password Min Length',
  sessionMaxAgeHours: 'Session Max Age (hours)',
  smtpHost: 'SMTP Host',
  smtpPort: 'SMTP Port',
  smtpUser: 'SMTP User',
  smtpPass: 'SMTP Pass',
  fromName: 'From Name',
  fromEmail: 'From Email',
  revalidateSeconds: 'Revalidate Seconds',
};

const fieldTypes = {
  smtpPort: 'number',
  passwordMinLength: 'number',
  sessionMaxAgeHours: 'number',
  revalidateSeconds: 'number',
  require2FA: 'boolean',
};

export default function SettingsPage() {
  const { data: session } = useSession();
  const role = session?.user?.role || 'VIEWER';
  const canEdit = role === 'ADMIN' || role === 'EDITOR';
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    getSettings()
      .then(data => { setSettings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'number' ? Number(value) : type === 'checkbox' ? checked : value,
    });
  };

  const handleFavicon = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const res = await uploadFavicon(file);
    if (res?.url) {
      setSettings({ ...settings, faviconUrl: res.url });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await updateSettings(settings);
    setSaving(false);
  };

  const renderField = (f) => {
    if (f === 'faviconUrl') {
      return (
        <div key={f}>
          <label className="block text-sm">{labels[f]}</label>
          {settings[f] && <img src={settings[f]} alt="favicon" className="w-8 h-8 mb-2" />}
          {canEdit && (
            <input type="file" accept="image/x-icon,image/png" onChange={handleFavicon} />
          )}
        </div>
      );
    }
    const type = fieldTypes[f];
    if (type === 'boolean') {
      return (
        <div key={f} className="flex items-center space-x-2">
          <input
            type="checkbox"
            name={f}
            checked={settings[f] || false}
            onChange={handleChange}
            disabled={!canEdit}
          />
          <label className="text-sm" htmlFor={f}>{labels[f]}</label>
        </div>
      );
    }
    return (
      <div key={f}>
        <label className="block text-sm">{labels[f]}</label>
        <input
          type={type === 'number' ? 'number' : 'text'}
          name={f}
          value={settings[f] ?? ''}
          onChange={handleChange}
          className="border p-2 w-full"
          readOnly={!canEdit}
        />
      </div>
    );
  };

  if (loading || !settings) return <div>Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl">
        Site Settings { !canEdit && <span className="ml-2 text-sm text-gray-500">(Read-only)</span> }
      </h1>
      <div className="flex space-x-4 border-b">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`pb-2 ${activeTab === t.key ? 'border-b-2 border-blue-600' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="space-y-4 pt-4">
        {fields[activeTab].map(renderField)}
      </div>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white"
        disabled={!canEdit || saving}
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}

