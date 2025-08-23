'use client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
  const [avatarPreview, setAvatarPreview] = useState(session?.user?.image || '');
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState(null);

  const handleSave = async () => {
    setLoading(true);
    if (newPassword !== confirmPassword) {
      setNotif({ id: Date.now(), type: 'error', message: 'New passwords do not match' });
      setLoading(false);
      return;
    }
    try {
      await updateProfile({
        name,
        currentPassword,
        newPassword,
        confirmPassword,
      });
      await update();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setNotif({ id: Date.now(), type: 'success', message: 'Profile updated' });
    } catch (err) {
      setNotif({ id: Date.now(), type: 'error', message: err.message || 'Failed to update profile' });
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
      setNotif({ id: Date.now(), type: 'success', message: 'Avatar updated' });
    } catch (err) {
      setNotif({ id: Date.now(), type: 'error', message: err.message || 'Failed to upload avatar' });
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {notif && (
        <Notification
          id={notif.id}
          type={notif.type}
          message={notif.message}
          onClose={() => setNotif(null)}
          position="top-right"
        />
      )}
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="flex items-center space-x-4">
          {avatarPreview ? (
            <img src={avatarPreview} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl">
              {(name || 'U').slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Avatar</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="mt-1 block w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <p className="mt-1 text-gray-600">You are an {session?.user?.role}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
