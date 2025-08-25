'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faEye, 
    faEyeSlash, 
    faUser, 
    faEnvelope, 
    faLock, 
    faCamera,
    faUserShield,
    faSave,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { updateProfile, uploadAvatarImage } from '@/app/services/api';
import Notification from '@/components/ui/Notification/Notification';

export default function MyAccountPage() {
    const { data: session, update } = useSession();
    const [name, setName] = useState(session?.user?.name || '');
    const email = session?.user?.email || '';
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(
        session?.user?.image || ''
    );
    const [loading, setLoading] = useState(false);
    const [notif, setNotif] = useState(null);

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || '');
            setAvatarPreview(session.user.image || '');
        }
    }, [session]);

    const handleSave = async () => {
        setLoading(true);
        setNotif(null);

        const isChangingPassword =
            newPassword || currentPassword || confirmPassword;

        if (isChangingPassword) {
            if (!currentPassword) {
                setNotif({
                    id: Date.now(),
                    type: 'error',
                    message:
                        'Silakan masukkan password Anda saat ini untuk mengubahnya.',
                });
                setLoading(false);
                return;
            }

            if (!newPassword) {
                setNotif({
                    id: Date.now(),
                    type: 'error',
                    message: 'Password baru tidak boleh kosong.',
                });
                setLoading(false);
                return;
            }

            const PASSWORD_MIN_LENGTH = 8;
            if (newPassword.length < PASSWORD_MIN_LENGTH) {
                setNotif({
                    id: Date.now(),
                    type: 'error',
                    message: `Password baru minimal harus ${PASSWORD_MIN_LENGTH} karakter.`,
                });
                setLoading(false);
                return;
            }

            if (newPassword !== confirmPassword) {
                setNotif({
                    id: Date.now(),
                    type: 'error',
                    message: 'Password baru dan konfirmasi tidak cocok.',
                });
                setLoading(false);
                return;
            }
        }

        try {
            const payload = { name };
            if (isChangingPassword) {
                payload.currentPassword = currentPassword;
                payload.newPassword = newPassword;
            }

            const res = await updateProfile(payload);
            await update();

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setNotif({
                id: Date.now(),
                type: 'success',
                message: res.message || 'Profil berhasil diperbarui',
            });
        } catch (err) {
            setNotif({
                id: Date.now(),
                type: 'error',
                message: err.message || 'Gagal memperbarui profil',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const res = await uploadAvatarImage(file);
            setAvatarPreview(res.imageUrl);
            await update();
            setNotif({
                id: Date.now(),
                type: 'success',
                message: 'Avatar berhasil diperbarui',
            });
        } catch (err) {
            setNotif({
                id: Date.now(),
                type: 'error',
                message: err.message || 'Gagal mengunggah avatar',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4 sm:px-6 lg:px-8">
            {notif && (
                <Notification
                    id={notif.id}
                    type={notif.type}
                    message={notif.message}
                    onClose={() => setNotif(null)}
                    position="top-right"
                />
            )}
            
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Pengaturan Akun
                    </h1>
                    <p className="text-gray-600">
                        Kelola informasi pribadi dan keamanan akun Anda
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Avatar Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                            <div className="text-center">
                                <div className="relative inline-block mb-4">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar"
                                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white">
                                            {(name || 'U').slice(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors duration-200 shadow-md">
                                        <FontAwesomeIcon icon={faCamera} className="w-4 h-4" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {name || 'Nama Pengguna'}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">{email}</p>
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    <FontAwesomeIcon icon={faUserShield} className="w-3 h-3 mr-1" />
                                    {session?.user?.role}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                            <div className="space-y-8">
                                {/* Personal Information */}
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                        <div className="bg-blue-100 text-blue-600 rounded-lg p-2 mr-3">
                                            <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
                                        </div>
                                        Informasi Pribadi
                                    </h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nama Lengkap
                                            </label>
                                            <div className="relative">
                                                <FontAwesomeIcon 
                                                    icon={faUser} 
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
                                                />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                    placeholder="Masukkan nama lengkap"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <div className="relative">
                                                <FontAwesomeIcon 
                                                    icon={faEnvelope} 
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
                                                />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    readOnly
                                                    className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-gray-50 cursor-not-allowed text-gray-600"
                                                    placeholder="Email tidak dapat diubah"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Password Section */}
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                        <div className="bg-red-100 text-red-600 rounded-lg p-2 mr-3">
                                            <FontAwesomeIcon icon={faLock} className="w-5 h-5" />
                                        </div>
                                        Keamanan Password
                                    </h2>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Password Saat Ini
                                            </label>
                                            <div className="relative">
                                                <FontAwesomeIcon 
                                                    icon={faLock} 
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
                                                />
                                                <input
                                                    type={showCurrent ? 'text' : 'password'}
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    className="pl-10 pr-10 w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                    placeholder="Masukkan password saat ini"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrent(!showCurrent)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                                >
                                                    <FontAwesomeIcon 
                                                        icon={showCurrent ? faEyeSlash : faEye} 
                                                        className="w-4 h-4" 
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Password Baru
                                                </label>
                                                <div className="relative">
                                                    <FontAwesomeIcon 
                                                        icon={faLock} 
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
                                                    />
                                                    <input
                                                        type={showNew ? 'text' : 'password'}
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="pl-10 pr-10 w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                        placeholder="Masukkan password baru"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNew(!showNew)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                                    >
                                                        <FontAwesomeIcon 
                                                            icon={showNew ? faEyeSlash : faEye} 
                                                            className="w-4 h-4" 
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Konfirmasi Password Baru
                                                </label>
                                                <div className="relative">
                                                    <FontAwesomeIcon 
                                                        icon={faLock} 
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
                                                    />
                                                    <input
                                                        type={showConfirm ? 'text' : 'password'}
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="pl-10 pr-10 w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                        placeholder="Konfirmasi password baru"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirm(!showConfirm)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                                    >
                                                        <FontAwesomeIcon 
                                                            icon={showConfirm ? faEyeSlash : faEye} 
                                                            className="w-4 h-4" 
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <p className="text-sm text-blue-700">
                                                <strong>Tips Keamanan:</strong> Gunakan kombinasi huruf besar, huruf kecil, 
                                                angka, dan simbol. Minimal 8 karakter untuk password yang kuat.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end pt-6 border-t border-gray-200">
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                                    >
                                        {loading ? (
                                            <FontAwesomeIcon 
                                                icon={faSpinner} 
                                                className="w-4 h-4 mr-2 animate-spin" 
                                            />
                                        ) : (
                                            <FontAwesomeIcon 
                                                icon={faSave} 
                                                className="w-4 h-4 mr-2" 
                                            />
                                        )}
                                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}