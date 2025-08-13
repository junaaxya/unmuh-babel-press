"use client";
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function UsersPage() {
  const { data: session } = useSession();
  const role = session?.user?.role || 'VIEWER';
  const canEdit = role === 'ADMIN';
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [form, setForm] = useState({ email: '', role: 'VIEWER' });
  const [search, setSearch] = useState('');

  const load = async (page = meta.page) => {
    const params = new URLSearchParams({ page, limit: meta.limit, search });
    const res = await fetch(`/api/admin/users?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setUsers(data.data);
      setMeta(data.meta);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    const handleInvite = async () => {
      await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ email: '', role: 'VIEWER' });
    };

    const changeRole = async (id, role) => {
      await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role }),
      });
      if (session?.user.id === id && role !== 'ADMIN') {
        await signOut({ callbackUrl: '/admin/login' });
        return;
      }
      load(meta.page);
    };

    const handleDelete = async (id) => {
      await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (session?.user.id === id) {
        await signOut({ callbackUrl: '/admin/login' });
        return;
      }
      load(meta.page);
    };

  const handleSearch = async (e) => {
    e.preventDefault();
    load(1);
  };

    return (
      <div className="p-4 space-y-4">
        <h1 className="text-2xl">
          Users { !canEdit && <span className="ml-2 text-sm text-gray-500">(Read-only)</span> }
        </h1>
        <form onSubmit={handleSearch} className="mb-4 space-x-2">
          <input
            placeholder="search email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2"
          />
          <button type="submit" className="px-4 py-2 bg-gray-600 text-white">Search</button>
        </form>
        {canEdit && (
          <div>
            <input
              placeholder="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border p-2 mr-2"
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="border p-2 mr-2"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="EDITOR">EDITOR</option>
              <option value="VIEWER">VIEWER</option>
            </select>
            <button type="button" onClick={handleInvite} className="px-4 py-2 bg-blue-600 text-white">
              Invite
            </button>
          </div>
        )}
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td>{u.email}</td>
                <td>
                  {canEdit ? (
                    <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)}>
                      <option value="ADMIN">ADMIN</option>
                      <option value="EDITOR">EDITOR</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                  ) : (
                    u.role
                  )}
                </td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
                <td>
                  {canEdit && session?.user.id !== u.id && (
                    <button onClick={() => handleDelete(u.id)} className="text-red-600">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex space-x-2">
          <button
            disabled={meta.page <= 1}
            onClick={() => load(meta.page - 1)}
            className="px-2 py-1 border"
          >
            Prev
          </button>
          <button
            disabled={meta.page * meta.limit >= meta.total}
            onClick={() => load(meta.page + 1)}
            className="px-2 py-1 border"
          >
            Next
          </button>
        </div>
      </div>
    );
  }
