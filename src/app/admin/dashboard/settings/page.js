'use client';

import { useEffect, useState } from 'react';
import Notification from '@/components/ui/Notification/Notification';
import { getSettings, updateSettings } from '../../../services/api';

export default function SettingsPage() {
    const [formData, setFormData] = useState({
        siteName: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        facebook: '',
        instagram: '',
        twitter: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSettings();
                if (data) {
                    setFormData({
                        siteName: data.siteName || '',
                        contactEmail: data.contactEmail || '',
                        contactPhone: data.contactPhone || '',
                        address: data.address || '',
                        facebook: data.facebook || '',
                        instagram: data.instagram || '',
                        twitter: data.twitter || '',
                    });
                }
            } catch (err) {
                console.error('Failed to load settings', err);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateSettings(formData);
            setNotification({
                id: Date.now(),
                type: 'success',
                message: 'Pengaturan berhasil diperbarui.',
            });
        } catch (err) {
            setNotification({
                id: Date.now(),
                type: 'error',
                message: err.message || 'Gagal memperbarui pengaturan.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">Pengaturan Situs</h1>
            {notification && (
                <Notification
                    key={notification.id}
                    {...notification}
                    onClose={() => setNotification(null)}
                />
            )}
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
                <div>
                    <label htmlFor="siteName" className="block text-sm font-medium mb-1">
                        Nama Situs
                    </label>
                    <input
                        id="siteName"
                        name="siteName"
                        type="text"
                        value={formData.siteName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium mb-1">
                        Email Kontak
                    </label>
                    <input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="contactPhone" className="block text-sm font-medium mb-1">
                        Telepon Kontak
                    </label>
                    <input
                        id="contactPhone"
                        name="contactPhone"
                        type="text"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium mb-1">
                        Alamat
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        rows="3"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="facebook" className="block text-sm font-medium mb-1">
                            Facebook
                        </label>
                        <input
                            id="facebook"
                            name="facebook"
                            type="text"
                            value={formData.facebook}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="instagram" className="block text-sm font-medium mb-1">
                            Instagram
                        </label>
                        <input
                            id="instagram"
                            name="instagram"
                            type="text"
                            value={formData.instagram}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="twitter" className="block text-sm font-medium mb-1">
                            Twitter
                        </label>
                        <input
                            id="twitter"
                            name="twitter"
                            type="text"
                            value={formData.twitter}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
            </form>
        </div>
    );
}
