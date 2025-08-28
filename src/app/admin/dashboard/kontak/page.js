// src/app/admin/dashboard/kontak/page.js

'use client';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Notification from '@/components/ui/Notification/Notification';
import {
    faMapMarkerAlt,
    faPhone,
    faEnvelope,
    faClock,
    faPlus,
    faTrash,
    faEdit,
    faSave,
    faSpinner,
    faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import {
    faFacebook,
    faInstagram,
    faTwitter,
    faLinkedin,
    faWhatsapp,
    faYoutube,
    faTelegram,
} from '@fortawesome/free-brands-svg-icons';

// Helper function untuk API request
async function apiRequest(url, method = 'GET', body = null) {
    const headers = {};
    if (body && typeof body !== 'string') {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(body);
    } else if (body && typeof body === 'string') {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, {
        method,
        headers,
        credentials: 'include',
        body: body || undefined,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(errorData.message || 'Request failed');
    }

    return res.json();
}

export default function AdminKontakPage() {
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({
        id: null,
        type: '',
        message: '',
    });

    const [contactData, setContactData] = useState({
        address: {
            street: '',
            city: '',
            province: '',
            postal: '',
        },
        phone: {
            number: '',
            whatsapp: '',
        },
        email: {
            general: '',
            submission: '',
        },
        hours: {
            weekdays: '',
            weekend: '',
            closed: '',
        },
        socialLinks: [],
    });

    const socialPlatforms = [
        { name: 'Facebook', icon: faFacebook, iconClass: 'fa-facebook' },
        { name: 'Instagram', icon: faInstagram, iconClass: 'fa-instagram' },
        { name: 'Twitter', icon: faTwitter, iconClass: 'fa-twitter' },
        { name: 'LinkedIn', icon: faLinkedin, iconClass: 'fa-linkedin' },
        { name: 'WhatsApp', icon: faWhatsapp, iconClass: 'fa-whatsapp' },
        { name: 'YouTube', icon: faYoutube, iconClass: 'fa-youtube' },
        { name: 'Telegram', icon: faTelegram, iconClass: 'fa-telegram' },
    ];

    useEffect(() => {
        loadContactData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadContactData = async () => {
        try {
            setLoading(true);
            const response = await apiRequest('/api/profile/contact');
            if (response.data) {
                const d = response.data;
                setContactData({
                    address: {
                        street: d.addressStreet || '',
                        city: d.addressCity || '',
                        province: d.addressProvince || '',
                        postal: d.addressPostal || '',
                    },
                    phone: {
                        number: d.phoneNumber || '',
                        whatsapp: d.phoneWhatsapp || '',
                    },
                    email: {
                        general: d.emailGeneral || '',
                        submission: d.emailSubmission || '',
                    },
                    hours: {
                        weekdays: d.hoursWeekdays || '',
                        weekend: d.hoursWeekend || '',
                        closed: d.hoursClosed || '',
                    },
                    socialLinks: (d.socialLinks || []).map((s, idx) => ({
                        platform: s.platform || '',
                        url: s.url || '',
                        icon: s.icon || socialPlatforms.find(p => p.name === s.platform)?.iconClass || 'fa-circle-info',
                        order: s.order ?? idx,
                    })),
                });
            }
        } catch (error) {
            showNotification('error', 'Gagal memuat data kontak');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ id: Date.now(), type, message });
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await apiRequest('/api/profile/contact', 'PUT', contactData);
            showNotification('success', 'Data kontak berhasil diperbarui');
        } catch (error) {
            showNotification(
                'error',
                error.message || 'Gagal memperbarui data kontak'
            );
        } finally {
            setLoading(false);
        }
    };

    const addSocialLink = () => {
        setContactData({
            ...contactData,
            socialLinks: [
                ...contactData.socialLinks,
                {
                    platform: 'Facebook',
                    url: '',
                    icon: 'fa-facebook',
                    order: contactData.socialLinks.length,
                }
            ]
        });
    };

    const removeSocialLink = (index) => {
        const newSocialLinks = contactData.socialLinks.filter((_, i) => i !== index);
        setContactData({ ...contactData, socialLinks: newSocialLinks });
    };

    const updateSocialLink = (index, field, value) => {
        const newSocialLinks = [...contactData.socialLinks];
        newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
        
        // If platform changes, update icon automatically
        if (field === 'platform') {
            const platform = socialPlatforms.find(p => p.name === value);
            if (platform) {
                newSocialLinks[index].icon = platform.iconClass;
            }
        }
        
        setContactData({ ...contactData, socialLinks: newSocialLinks });
    };

    const updateNestedField = (section, field, value) => {
        setContactData({
            ...contactData,
            [section]: {
                ...contactData[section],
                [field]: value,
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Kontak</h1>
                    <p className="text-gray-600 mt-1">
                        Kelola informasi kontak dan media sosial perusahaan
                    </p>
                </div>
            </div>

            {notification.id && (
                <Notification
                    id={notification.id}
                    type={notification.type}
                    message={notification.message}
                    onClose={() =>
                        setNotification({ id: null, type: '', message: '' })
                    }
                />
            )}

            {loading && (
                <div className="flex justify-center items-center py-12">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-2xl text-blue-600" />
                </div>
            )}

            {!loading && (
                <div className="space-y-6">
                    {/* Address Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-red-600" />
                            Alamat
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jalan
                                </label>
                                <input
                                    type="text"
                                    value={contactData.address.street}
                                    onChange={(e) => updateNestedField('address', 'street', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nama jalan dan nomor"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kota
                                </label>
                                <input
                                    type="text"
                                    value={contactData.address.city}
                                    onChange={(e) => updateNestedField('address', 'city', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nama kota"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Provinsi
                                </label>
                                <input
                                    type="text"
                                    value={contactData.address.province}
                                    onChange={(e) => updateNestedField('address', 'province', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nama provinsi"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kode Pos
                                </label>
                                <input
                                    type="text"
                                    value={contactData.address.postal}
                                    onChange={(e) => updateNestedField('address', 'postal', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Kode pos"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Phone Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <FontAwesomeIcon icon={faPhone} className="mr-2 text-green-600" />
                            Telepon
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nomor Telepon
                                </label>
                                <input
                                    type="text"
                                    value={contactData.phone.number}
                                    onChange={(e) => updateNestedField('phone', 'number', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Contoh: +62 21 1234567"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    WhatsApp
                                </label>
                                <input
                                    type="text"
                                    value={contactData.phone.whatsapp}
                                    onChange={(e) => updateNestedField('phone', 'whatsapp', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Contoh: 628123456789"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Email Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-blue-600" />
                            Email
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Umum
                                </label>
                                <input
                                    type="email"
                                    value={contactData.email.general}
                                    onChange={(e) => updateNestedField('email', 'general', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="info@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Submission
                                </label>
                                <input
                                    type="email"
                                    value={contactData.email.submission}
                                    onChange={(e) => updateNestedField('email', 'submission', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="submission@example.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Operating Hours Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <FontAwesomeIcon icon={faClock} className="mr-2 text-purple-600" />
                            Jam Operasional
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hari Kerja
                                </label>
                                <input
                                    type="text"
                                    value={contactData.hours.weekdays}
                                    onChange={(e) => updateNestedField('hours', 'weekdays', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Contoh: Senin - Jumat: 08.00 - 17.00 WIB"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Akhir Pekan
                                </label>
                                <input
                                    type="text"
                                    value={contactData.hours.weekend}
                                    onChange={(e) => updateNestedField('hours', 'weekend', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Contoh: Sabtu: 09.00 - 14.00 WIB"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hari Libur
                                </label>
                                <input
                                    type="text"
                                    value={contactData.hours.closed}
                                    onChange={(e) => updateNestedField('hours', 'closed', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Contoh: Minggu: Tutup"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold flex items-center">
                                <FontAwesomeIcon icon={faGlobe} className="mr-2 text-indigo-600" />
                                Media Sosial
                            </h3>
                            <button
                                onClick={addSocialLink}
                                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                                Tambah
                            </button>
                        </div>

                        {contactData.socialLinks.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                Belum ada media sosial yang ditambahkan
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {contactData.socialLinks.map((social, index) => (
                                    <div key={index} className="border border-gray-200 rounded-md p-4">
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Platform
                                                </label>
                                                <select
                                                    value={social.platform}
                                                    onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {socialPlatforms.map((platform) => (
                                                        <option key={platform.name} value={platform.name}>
                                                            {platform.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={social.url}
                                                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="https://..."
                                                />
                                            </div>

                                            <div className="flex items-end">
                                                <button
                                                    onClick={() => removeSocialLink(index)}
                                                    className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Preview */}
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <span>Preview:</span>
                                                {socialPlatforms.find(p => p.name === social.platform) && (
                                                    <FontAwesomeIcon 
                                                        icon={socialPlatforms.find(p => p.name === social.platform).icon}
                                                        className="text-blue-600"
                                                    />
                                                )}
                                                <span>{social.platform}</span>
                                                {social.url && (
                                                    <>
                                                        <span>-</span>
                                                        <a 
                                                            href={social.url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline truncate max-w-xs"
                                                        >
                                                            {social.url}
                                                        </a>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? (
                                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                            ) : (
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                            )}
                            Simpan Semua Perubahan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}