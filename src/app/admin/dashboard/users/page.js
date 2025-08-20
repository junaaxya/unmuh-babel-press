"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function UsersPage() {
  const { data: session } = useSession();
  const role = session?.user?.role || "VIEWER";
  const canManage = role === "ADMIN";

  const [users, setUsers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [form, setForm] = useState({ email: "", role: "VIEWER" });


  const loadUsers = async () => {
    const res = await fetch("/api/admin/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.data);
    }
  };

  const loadInvites = async () => {
    if (!canManage) return;
    const res = await fetch("/api/admin/invitations");
    if (res.ok) {
      setInvites(await res.json());
    }
  };

  useEffect(() => {
    loadUsers();
    loadInvites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleInvite = async () => {
    await fetch("/api/admin/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ email: "", role: "VIEWER" });
    loadInvites();
  };


  const changeRole = async (id, role) => {
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    });
    if (session?.user.id === id && role !== "ADMIN") {
      await signOut({ callbackUrl: "/admin/login" });
      return;
    }
    loadUsers();
  };

  const handleDelete = async (id) => {
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (session?.user.id === id) {
      await signOut({ callbackUrl: "/admin/login" });
      return;
    }
    loadUsers();
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl">Users { !canManage && <span className="ml-2 text-sm text-gray-500">(Read-only)</span> }</h1>
      {canManage && (
        <div className="space-x-2">
          <input
            placeholder="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-2"
          />

          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="border p-2"

          >
            <option value="ADMIN">ADMIN</option>
            <option value="EDITOR">EDITOR</option>
            <option value="VIEWER">VIEWER</option>
          </select>
          <button
            type="button"
            onClick={handleInvite}
            className="px-4 py-2 bg-blue-600 text-white"
          >
            Invite
          </button>
        </div>
      )}

      {canManage && invites.length > 0 && (
        <div>
          <h2 className="text-xl mt-4">Pending Invitations</h2>
          <ul className="list-disc ml-6">
            {invites.map((i) => (
              <li key={i.id}>{i.email} (expires {new Date(i.expires).toLocaleDateString()})</li>
            ))}
          </ul>
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
                {canManage ? (
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
                {canManage && session?.user.id !== u.id && (
                  <button onClick={() => handleDelete(u.id)} className="text-red-600">
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

