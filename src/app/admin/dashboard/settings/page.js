"use client";
import { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '@/app/services/api';

const stringFields = [
  'siteName','contactEmail','contactPhone','address','facebook','instagram','twitter','faviconUrl','logoUrl','defaultTitle','defaultDescription','ogImageUrl','smtpHost','smtpUser','smtpPass','fromName','fromEmail','imageDomains','ga4MeasurementId','metaPixelId','webhookUrl'
];
const numberFields = ['smtpPort','passwordMinLength','sessionMaxAgeHours','revalidateSeconds'];
const booleanFields = ['require2FA'];
const labels = {
  siteName: 'Site Name',
  contactEmail: 'Contact Email',
  contactPhone: 'Contact Phone',
  address: 'Address',
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'Twitter',
  faviconUrl: 'Favicon URL',
  logoUrl: 'Logo URL',
  defaultTitle: 'Default Title',
  defaultDescription: 'Default Description',
  ogImageUrl: 'OG Image URL',
  smtpHost: 'SMTP Host',
  smtpUser: 'SMTP User',
  smtpPass: 'SMTP Pass',
  fromName: 'From Name',
  fromEmail: 'From Email',
  imageDomains: 'Image Domains',
  ga4MeasurementId: 'GA4 Measurement ID',
  metaPixelId: 'Meta Pixel ID',
  webhookUrl: 'Webhook URL',
  smtpPort: 'SMTP Port',
  passwordMinLength: 'Password Min Length',
  sessionMaxAgeHours: 'Session Max Age (hours)',
  revalidateSeconds: 'Revalidate Seconds',
  require2FA: 'Require 2FA',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const handleSave = async () => {
    setSaving(true);
    await updateSettings(settings);
    setSaving(false);
  };

  if (loading || !settings) return <div>Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl">Site Settings</h1>
      {stringFields.map((f) => (
        <div key={f}>
          <label className="block text-sm">{labels[f]}</label>
          <input
            name={f}
            value={settings[f] || ''}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
      ))}
      {numberFields.map((f) => (
        <div key={f}>
          <label className="block text-sm">{labels[f]}</label>
          <input
            type="number"
            name={f}
            value={settings[f] ?? ''}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
      ))}
      {booleanFields.map((f) => (
        <div key={f} className="flex items-center space-x-2">
          <input
            type="checkbox"
            name={f}
            checked={settings[f] || false}
            onChange={handleChange}
          />
          <label className="text-sm" htmlFor={f}>{labels[f]}</label>
        </div>
      ))}
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
