'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getSettings, updateSettings } from '@/app/services/api';
import FaviconUploader from './FaviconUploader';
import Notification from '@/components/ui/Notification/Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faShieldAlt,
  faSave,
  faSpinner,
  faEye,
  faGlobe,
  faImage,
  faClock,
  faInfoCircle,
  faExclamationTriangle,
  faCheckCircle,
  faSyncAlt,
  faBolt,
  faTextWidth,
  faHourglassHalf,
  faQuestionCircle,
  faInfo,
  faCogs
} from '@fortawesome/free-solid-svg-icons';

export default function SettingsPage() {
  const { data: session } = useSession();
  const role = session?.user?.role ?? 'VIEWER';
  const canEdit = role === 'ADMIN' || role === 'EDITOR';

  const [tab, setTab] = useState('general');
  const [settings, setSettings] = useState({ 
    siteName: '', 
    faviconUrl: '', 
    sessionMaxAgeHours: 24 
  });
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
          message: 'Gagal memuat pengaturan. Silakan coba lagi.',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
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
        message: 'Pengaturan berhasil disimpan!',
      });
    } catch (err) {
      setErrors(err.fieldErrors || {});
      setNotification({
        id: Date.now(),
        type: 'error',
        message: err.message || 'Gagal menyimpan pengaturan. Periksa input Anda dan coba lagi.',
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-6 max-w-sm w-full">
          <div className="relative">
            <div className="w-16 h-16 bg-blue-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Memuat Pengaturan</h3>
            <p className="text-gray-600">Harap tunggu sebentar...</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { 
      key: 'general', 
      label: 'Umum', 
      icon: faCog,
      description: 'Pengaturan dasar aplikasi'
    },
    { 
      key: 'security', 
      label: 'Keamanan', 
      icon: faShieldAlt,
      description: 'Pengaturan sesi dan autentikasi'
    }
  ];

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="px-6 sm:px-8 py-6 sm:py-8 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              {/* Title Section */}
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faCogs} className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Pengaturan Sistem
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base flex items-center gap-2 flex-wrap">
                    <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-gray-400" />
                    <span>Kelola konfigurasi aplikasi Anda</span>
                    {!canEdit && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full border border-yellow-200">
                        <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                        Hanya Lihat
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Save Button */}
              {canEdit && (
                <div className="flex-shrink-0">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {saving ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 mr-2 animate-spin" />
                        <span className="hidden sm:inline">Menyimpan...</span>
                        <span className="sm:hidden">Simpan...</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Simpan Pengaturan</span>
                        <span className="sm:hidden">Simpan</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 sm:px-8">
            <nav className="flex flex-col sm:flex-row gap-2 sm:gap-1 py-4">
              {tabs.map((tabItem) => (
                <button
                  key={tabItem.key}
                  onClick={() => setTab(tabItem.key)}
                  className={`group flex items-center px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium rounded-xl transition-all duration-200 ${
                    tab === tabItem.key
                      ? 'text-blue-700 bg-blue-50 border-2 border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <FontAwesomeIcon 
                    icon={tabItem.icon} 
                    className={`w-4 h-4 mr-3 ${
                      tab === tabItem.key ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`} 
                  />
                  <div className="text-left">
                    <div className="font-semibold">{tabItem.label}</div>
                    <div className="text-xs opacity-75 hidden sm:block">{tabItem.description}</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 sm:p-8">
            {tab === 'general' && (
              <div className="space-y-8">
                {/* Section Header */}
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={faCog} className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Pengaturan Umum</h2>
                  </div>
                  <p className="text-gray-600 ml-11">Konfigurasi informasi dasar dan branding situs</p>
                </div>

                <div className="space-y-8">
                  {/* Site Name Field */}
                  <div className="group">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <FontAwesomeIcon icon={faGlobe} className="w-4 h-4 mr-2 text-blue-500" />
                      Nama Situs
                      <span className="text-red-500 ml-1">*</span>
                      <FontAwesomeIcon 
                        icon={faQuestionCircle} 
                        className="w-4 h-4 ml-2 text-gray-400 cursor-help" 
                        title="Nama yang akan ditampilkan sebagai judul situs"
                      />
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => handleChange('siteName', e.target.value)}
                        readOnly={!canEdit}
                        placeholder="Masukkan nama situs Anda"
                        className={`w-full px-4 py-4 pl-12 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 ${
                          errors.siteName 
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                        } ${!canEdit ? 'bg-gray-100 cursor-not-allowed opacity-75' : 'focus:bg-white'}`}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <FontAwesomeIcon icon={faTextWidth} className="w-4 h-4 text-gray-400" />
                      </div>
                      {canEdit && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                            {settings.siteName.length}/100
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.siteName && (
                      <div className="flex items-center mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-red-500 mr-2" />
                        <p className="text-sm text-red-700 font-medium">{errors.siteName[0]}</p>
                      </div>
                    )}
                  </div>

                  {/* Favicon Field */}
                  <div className="group">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <FontAwesomeIcon icon={faImage} className="w-4 h-4 mr-2 text-blue-500" />
                      Favicon
                      <FontAwesomeIcon 
                        icon={faQuestionCircle} 
                        className="w-4 h-4 ml-2 text-gray-400 cursor-help" 
                        title="Ikon kecil yang muncul di tab browser"
                      />
                    </label>
                    <div className="bg-blue-50 rounded-xl p-6 border-2 border-dashed border-blue-300 hover:border-blue-400 transition-all duration-200">
                      <FaviconUploader
                        value={settings.faviconUrl}
                        onChange={(url) => handleChange('faviconUrl', url)}
                      />
                    </div>
                    {errors.faviconUrl && (
                      <div className="flex items-center mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-red-500 mr-2" />
                        <p className="text-sm text-red-700 font-medium">{errors.faviconUrl[0]}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {tab === 'security' && (
              <div className="space-y-8">
                {/* Section Header */}
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={faShieldAlt} className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Pengaturan Keamanan</h2>
                  </div>
                  <p className="text-gray-600 ml-11">Konfigurasi sesi dan pengaturan autentikasi</p>
                </div>

                <div className="space-y-8">
                  {/* Session Max Age Field */}
                  <div className="group">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-2 text-blue-500" />
                      Durasi Maksimal Sesi
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-4 ml-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 mr-2 text-blue-500" />
                      Durasi maksimal untuk sesi pengguna (1-720 jam). Pengguna akan otomatis logout setelah tidak aktif.
                    </p>
                    
                    <div className="relative max-w-md">
                      <input
                        type="number"
                        min="1"
                        max="720"
                        value={settings.sessionMaxAgeHours}
                        onChange={(e) => handleChange('sessionMaxAgeHours', e.target.value)}
                        readOnly={!canEdit}
                        placeholder="24"
                        className={`w-full px-4 py-4 pl-12 pr-20 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 ${
                          errors.sessionMaxAgeHours 
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                        } ${!canEdit ? 'bg-gray-100 cursor-not-allowed opacity-75' : 'focus:bg-white'}`}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <FontAwesomeIcon icon={faHourglassHalf} className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span className="text-sm text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">jam</span>
                      </div>
                    </div>
                    
                    {errors.sessionMaxAgeHours && (
                      <div className="flex items-center mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-red-500 mr-2" />
                        <p className="text-sm text-red-700 font-medium">{errors.sessionMaxAgeHours[0]}</p>
                      </div>
                    )}
                    
                    {/* Info Card */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FontAwesomeIcon icon={faInfo} className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-blue-900 mb-2">Informasi Durasi Sesi</h4>
                          <div className="space-y-2 text-sm text-blue-800">
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-blue-600" />
                              <span>Pengaturan saat ini: <strong>{settings.sessionMaxAgeHours} jam</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-blue-600" />
                              <span>Pengguna akan logout otomatis setelah tidak aktif</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faSyncAlt} className="w-4 h-4 text-blue-600" />
                              <span>Perubahan berlaku setelah disimpan</span>
                            </div>
                          </div>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
            <FontAwesomeIcon icon={faBolt} className="w-4 h-4 text-blue-500" />
            <p className="text-sm text-gray-600 font-medium">
              Perubahan akan berlaku segera setelah disimpan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}