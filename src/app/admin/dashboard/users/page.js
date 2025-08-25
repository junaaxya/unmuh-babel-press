'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers,
  faPlus,
  faTrash,
  faEnvelope,
  faPaperPlane,
  faUserShield,
  faUserEdit,
  faEye,
  faClock,
  faExclamationTriangle,
  faSpinner,
  faCheck,
  faTimes,
  faUserPlus,
  faCalendarAlt,
  faChevronDown,
  faSearch,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import Notification from '@/components/ui/Notification/Notification';

export default function UsersPage() {
  const { data: session } = useSession();
  const role = session?.user?.role || 'VIEWER';
  const canManage = role === 'ADMIN';

  const [users, setUsers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [form, setForm] = useState({ email: '', role: 'VIEWER' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [showInvites, setShowInvites] = useState(true);
  const [resendingEmail, setResendingEmail] = useState(null);

  // Existing functions remain the same
  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.data);
      } else {
        throw new Error('Gagal memuat data pengguna');
      }
    } catch (error) {
      setNotification({
        id: Date.now(),
        type: 'error',
        message: 'Gagal memuat data pengguna. Silakan refresh halaman.',
      });
    }
  }, []);

  const loadInvites = useCallback(async () => {
    if (!canManage) return;
    try {
      const res = await fetch('/api/admin/invitations');
      if (res.ok) {
        setInvites(await res.json());
      } else {
        throw new Error('Gagal memuat data undangan');
      }
    } catch (error) {
      setNotification({
        id: Date.now(),
        type: 'error',
        message: 'Gagal memuat data undangan.',
      });
    }
  }, [canManage]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const tasks = [loadUsers()];
      if (canManage) tasks.push(loadInvites());
      await Promise.all(tasks);
      setLoading(false);
    };
    fetchData();
  }, [loadUsers, loadInvites, canManage]);

  const validateForm = () => {
    const errors = {};
    if (!form.email.trim()) {
      errors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Format email tidak valid';
    }
    if (!form.role) {
      errors.role = 'Peran wajib dipilih';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInvite = async () => {
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ email: '', role: 'VIEWER' });
        setShowInviteForm(false);
        setFormErrors({});
        setNotification({
          id: Date.now(),
          type: 'success',
          message: `Undangan berhasil dikirim ke ${form.email}`,
        });
        await loadInvites();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal mengirim undangan');
      }
    } catch (error) {
      setNotification({
        id: Date.now(),
        type: 'error',
        message: error.message || 'Gagal mengirim undangan. Silakan coba lagi.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendInvite = async (email) => {
    setResendingEmail(email);
    try {
      const res = await fetch('/api/admin/invitations/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setNotification({
          id: Date.now(),
          type: 'success',
          message: `Undangan berhasil dikirim ulang ke ${email}`,
        });
        await loadInvites();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal mengirim ulang undangan');
      }
    } catch (error) {
      setNotification({
        id: Date.now(),
        type: 'error',
        message: error.message || 'Gagal mengirim ulang undangan',
      });
    } finally {
      setResendingEmail(null);
    }
  };

  const changeRole = async (id, newRole) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: newRole }),
      });

      if (res.ok) {
        setNotification({
          id: Date.now(),
          type: 'success',
          message: 'Peran pengguna berhasil diperbarui',
        });

        if (session?.user.id === id && newRole !== 'ADMIN') {
          setNotification({
            id: Date.now(),
            type: 'warning',
            message: 'Anda akan diarahkan ke halaman login karena peran Anda berubah',
          });
          setTimeout(() => {
            signOut({ callbackUrl: '/admin/login' });
          }, 2000);
          return;
        }
        await loadUsers();
      } else {
        throw new Error('Gagal mengubah peran pengguna');
      }
    } catch (error) {
      setNotification({
        id: Date.now(),
        type: 'error',
        message: error.message || 'Gagal mengubah peran pengguna',
      });
    }
  };

  const handleDelete = async (id, email) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setNotification({
          id: Date.now(),
          type: 'success',
          message: `Pengguna ${email} berhasil dihapus`,
        });

        if (session?.user.id === id) {
          setTimeout(() => {
            signOut({ callbackUrl: '/admin/login' });
          }, 2000);
          return;
        }
        await loadUsers();
      } else {
        throw new Error('Gagal menghapus pengguna');
      }
    } catch (error) {
      setNotification({
        id: Date.now(),
        type: 'error',
        message: error.message || 'Gagal menghapus pengguna',
      });
    }
  };

  const confirmDelete = (user) => {
    setConfirmDialog({
      title: 'Konfirmasi Hapus Pengguna',
      message: `Apakah Anda yakin ingin menghapus pengguna "${user.email}"? Tindakan ini tidak dapat dibatalkan.`,
      onConfirm: () => {
        handleDelete(user.id, user.email);
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'EDITOR':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'VIEWER':
        return 'bg-gray-50 text-gray-700 border border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ADMIN':
        return faUserShield;
      case 'EDITOR':
        return faUserEdit;
      case 'VIEWER':
        return faEye;
      default:
        return faEye;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'EDITOR':
        return 'Editor';
      case 'VIEWER':
        return 'Penampil';
      default:
        return role;
    }
  };

  // Filter users based on search and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <FontAwesomeIcon 
              icon={faSpinner} 
              className="w-12 h-12 text-blue-600 animate-spin"
            />
          </div>
          <p className="text-gray-600 font-medium">Memuat data pengguna...</p>
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

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faExclamationTriangle} className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{confirmDialog.title}</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={confirmDialog.onCancel}
                className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Batal
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium"
              >
                <FontAwesomeIcon icon={faTrash} className="w-4 h-4 mr-2" />
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 lg:mb-8">
          <div className="px-6 lg:px-8 py-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Kelola Pengguna</h1>
                  <p className="text-gray-600 mt-1 flex items-center">
                    Kelola pengguna dan peran mereka dalam sistem
                    {!canManage && (
                      <span className="ml-3 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                        <FontAwesomeIcon icon={faEye} className="w-3 h-3 mr-1" />
                        Hanya Baca
                      </span>
                    )}
                  </p>
                </div>
              </div>
              {canManage && (
                <button
                  onClick={() => setShowInviteForm(!showInviteForm)}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
                >
                  <FontAwesomeIcon icon={faUserPlus} className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Undang Pengguna Baru</span>
                  <span className="sm:hidden">Undang Pengguna</span>
                </button>
              )}
            </div>
          </div>

          {/* Invite Form */}
          {canManage && showInviteForm && (
            <div className="px-6 lg:px-8 py-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
              <div className="flex items-center mb-6">
                <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Undang Pengguna Baru</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="nama@contoh.com"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        if (formErrors.email) setFormErrors({ ...formErrors, email: null });
                      }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 mr-1" />
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div className="lg:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peran <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={form.role}
                      onChange={(e) => {
                        setForm({ ...form, role: e.target.value });
                        if (formErrors.role) setFormErrors({ ...formErrors, role: null });
                      }}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none ${
                        formErrors.role ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="VIEWER">
                        Penampil
                      </option>
                      <option value="EDITOR">
                        Editor
                      </option>
                      <option value="ADMIN">
                        Administrator
                      </option>
                    </select>
                    <FontAwesomeIcon icon={faChevronDown} className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  {formErrors.role && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 mr-1" />
                      {formErrors.role}
                    </p>
                  )}
                </div>
                <div className="lg:col-span-3 flex flex-col justify-end">
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleInvite}
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center">
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Mengirim...</span>
                          <span className="sm:hidden">...</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <FontAwesomeIcon icon={faCheck} className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Kirim Undangan</span>
                          <span className="sm:hidden">Kirim</span>
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowInviteForm(false);
                        setForm({ email: '', role: 'VIEWER' });
                        setFormErrors({});
                      }}
                      className="px-4 py-3 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pending Invitations */}
        {canManage && invites.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 lg:mb-8">
            <div className="px-6 lg:px-8 py-6 border-b border-gray-100">
              <button
                onClick={() => setShowInvites(!showInvites)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Undangan Tertunda</h2>
                    <p className="text-sm text-gray-600 mt-1">{invites.length} undangan belum dikonfirmasi</p>
                  </div>
                </div>
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showInvites ? 'rotate-180' : ''}`} 
                />
              </button>
            </div>
            
            {showInvites && (
              <div className="px-6 lg:px-8 py-6">
                <div className="space-y-4">
                  {invites.map((invite) => (
                    <div key={invite.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <div className="flex items-center mb-3 sm:mb-0">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">{invite.email}</p>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3 mr-1" />
                            Kedaluwarsa pada {new Date(invite.expires).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end space-x-3">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center ${getRoleBadgeColor(invite.role)}`}>
                          <FontAwesomeIcon icon={getRoleIcon(invite.role)} className="w-3 h-3 mr-1" />
                          {getRoleLabel(invite.role)}
                        </span>
                        <button
                          onClick={() => handleResendInvite(invite.email)}
                          disabled={resendingEmail === invite.email}
                          className="inline-flex items-center px-3 py-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200 text-xs font-medium disabled:opacity-50"
                        >
                          {resendingEmail === invite.email ? (
                            <>
                              <FontAwesomeIcon icon={faSpinner} className="w-3 h-3 mr-2 animate-spin" />
                              Mengirim...
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faPaperPlane} className="w-3 h-3 mr-2" />
                              Kirim Ulang
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="px-6 lg:px-8 py-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Daftar Pengguna</h2>
                <p className="text-gray-600 mt-1">Total {filteredUsers.length} dari {users.length} pengguna</p>
              </div>
              
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="relative">
                  <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari pengguna..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full sm:w-64"
                  />
                </div>
                <div className="relative">
                  <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none w-full sm:w-48"
                  >
                    <option value="ALL">Semua Peran</option>
                    <option value="ADMIN">Administrator</option>
                    <option value="EDITOR">Editor</option>
                    <option value="VIEWER">Penampil</option>
                  </select>
                  <FontAwesomeIcon icon={faChevronDown} className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pengguna
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Peran
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bergabung
                  </th>
                  <th className="px-8 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                          {session?.user.id === user.id && (
                            <p className="text-xs text-blue-600 font-medium flex items-center mt-1">
                              <FontAwesomeIcon icon={faCheck} className="w-3 h-3 mr-1" />
                              Anda
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {canManage ? (
                        <div className="relative">
                          <select
                            value={user.role}
                            onChange={(e) => changeRole(user.id, e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none pr-10"
                          >
                            <option value="ADMIN">Administrator</option>
                            <option value="EDITOR">Editor</option>
                            <option value="VIEWER">Penampil</option>
                          </select>
                          <FontAwesomeIcon icon={faChevronDown} className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      ) : (
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center w-fit ${getRoleBadgeColor(user.role)}`}>
                          <FontAwesomeIcon icon={getRoleIcon(user.role)} className="w-3 h-3 mr-1" />
                          {getRoleLabel(user.role)}
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <FontAwesomeIcon icon={faClock} className="w-3 h-3 mr-1" />
                        {new Date(user.createdAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {canManage && session?.user.id !== user.id && (
                        <button
                          onClick={() => confirmDelete(user)}
                          className="inline-flex items-center px-4 py-2.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm font-medium"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-4 h-4 mr-2" />
                          Hapus
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-white font-semibold">
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-medium text-gray-900 truncate">{user.email}</p>
                      {session?.user.id === user.id && (
                        <p className="text-sm text-blue-600 font-medium flex items-center mt-1">
                          <FontAwesomeIcon icon={faCheck} className="w-3 h-3 mr-1" />
                          Anda
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                      Peran
                    </label>
                    {canManage ? (
                      <div className="relative">
                        <select
                          value={user.role}
                          onChange={(e) => changeRole(user.id, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none pr-10"
                        >
                          <option value="ADMIN">Administrator</option>
                          <option value="EDITOR">Editor</option>
                          <option value="VIEWER">Penampil</option>
                        </select>
                        <FontAwesomeIcon icon={faChevronDown} className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    ) : (
                      <span className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center w-fit ${getRoleBadgeColor(user.role)}`}>
                        <FontAwesomeIcon icon={getRoleIcon(user.role)} className="w-4 h-4 mr-2" />
                        {getRoleLabel(user.role)}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                      Bergabung
                    </label>
                    <div className="text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <FontAwesomeIcon icon={faClock} className="w-3 h-3 mr-1" />
                      {new Date(user.createdAt).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
                
                {canManage && session?.user.id !== user.id && (
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() => confirmDelete(user)}
                      className="w-full inline-flex items-center justify-center px-4 py-3 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm font-medium"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-4 h-4 mr-2" />
                      Hapus Pengguna
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faUsers} className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterRole !== 'ALL' ? 'Tidak ada pengguna ditemukan' : 'Belum ada pengguna'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterRole !== 'ALL' 
                  ? 'Coba ubah kata kunci pencarian atau filter peran.' 
                  : 'Mulai dengan mengundang pengguna pertama Anda.'
                }
              </p>
              {searchTerm || filterRole !== 'ALL' ? (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterRole('ALL');
                  }}
                  className="inline-flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-4 h-4 mr-2" />
                  Hapus Filter
                </button>
              ) : canManage ? (
                <button
                  onClick={() => setShowInviteForm(true)}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faUserPlus} className="w-5 h-5 mr-2" />
                  Undang Pengguna Pertama
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}