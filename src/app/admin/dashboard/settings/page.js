'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getSettings, updateSettings } from '@/app/services/api';
import FaviconUploader from './FaviconUploader';
import Notification from '@/components/ui/Notification/Notification';

export default function SettingsPage() {
  const { data: session } = useSession();
  const role = session?.user?.role ?? 'VIEWER';
  const canEdit = role === 'ADMIN' || role === 'EDITOR';

  const [tab, setTab] = useState('general');
  const [settings, setSettings] = useState({ siteName: '', faviconUrl: '', sessionMaxAgeHours: 24 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

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
      } catch (err) {
        setNotification({
          id: Date.now(),
          type: 'error',
          message: 'Failed to load settings. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    // Clear field error when user starts typing
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  const handleSave = async () => {
    if (!canEdit) return;
    setSaving(true);
    setErrors({});
    
    try {
      const payload = {
        siteName: settings.siteName.trim(),
        sessionMaxAgeHours: parseInt(settings.sessionMaxAgeHours, 10),
      };
      if (settings.faviconUrl) {
        payload.faviconUrl = settings.faviconUrl;
      }
      await updateSettings(payload);
      setNotification({
        id: Date.now(),
        type: 'success',
        message: 'Settings saved successfully!',
      });
    } catch (err) {
      setErrors(err.fieldErrors || {});
      setNotification({
        id: Date.now(),
        type: 'error',
        message: err.message || 'Failed to save settings. Please check your inputs and try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const closeNotification = () => {
    setNotification(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <Notification
          id={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={closeNotification}
          position="top-right"
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                  <p className="text-sm text-gray-500">
                    Manage your application configuration
                    {!canEdit && <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">Read-only</span>}
                  </p>
                </div>
              </div>
              {canEdit && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Settings
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-8">
            <nav className="flex space-x-1">
              {[
                { key: 'general', label: 'General', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4' },
                { key: 'security', label: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }
              ].map((tabItem) => (
                <button
                  key={tabItem.key}
                  onClick={() => setTab(tabItem.key)}
                  className={`flex items-center px-6 py-4 text-sm font-medium rounded-xl transition-all duration-200 ${
                    tab === tabItem.key
                      ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tabItem.icon} />
                  </svg>
                  {tabItem.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-8">
            {tab === 'general' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">General Settings</h2>
                  <p className="text-gray-600 text-sm mb-6">Configure basic site information and branding</p>
                </div>

                <div className="grid gap-6">
                  {/* Site Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Site Name
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => handleChange('siteName', e.target.value)}
                        readOnly={!canEdit}
                        placeholder="Enter your site name"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                          errors.siteName 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        } ${!canEdit ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                      </div>
                    </div>
                    {errors.siteName && (
                      <div className="flex items-center mt-1">
                        <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-red-600">{errors.siteName[0]}</p>
                      </div>
                    )}
                  </div>

                  {/* Favicon */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Favicon
                    </label>
                    <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                      <FaviconUploader
                        value={settings.faviconUrl}
                        onChange={(url) => handleChange('faviconUrl', url)}
                      />
                    </div>
                    {errors.faviconUrl && (
                      <div className="flex items-center mt-1">
                        <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-red-600">{errors.faviconUrl[0]}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {tab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Security Settings</h2>
                  <p className="text-gray-600 text-sm mb-6">Configure session and authentication settings</p>
                </div>

                <div className="grid gap-6">
                  {/* Session Max Age */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Session Max Age
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Maximum duration for user sessions (1-720 hours)
                    </p>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="720"
                        value={settings.sessionMaxAgeHours}
                        onChange={(e) => handleChange('sessionMaxAgeHours', e.target.value)}
                        readOnly={!canEdit}
                        placeholder="24"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                          errors.sessionMaxAgeHours 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        } ${!canEdit ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-sm text-gray-500">hours</span>
                      </div>
                    </div>
                    {errors.sessionMaxAgeHours && (
                      <div className="flex items-center mt-1">
                        <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-red-600">{errors.sessionMaxAgeHours[0]}</p>
                      </div>
                    )}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                      <div className="flex items-start">
                        <svg className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm text-blue-800">
                          <p className="font-medium">Session Duration Info</p>
                          <p className="mt-1">Users will be automatically logged out after this duration of inactivity. Current setting: <strong>{settings.sessionMaxAgeHours} hours</strong></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Changes will take effect immediately after saving
          </p>
        </div>
      </div>
    </div>
  );
}