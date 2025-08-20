"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";

export default function AcceptInvitationPage({ params }) {
  const router = useRouter();
  const { token } = use(params);
  const [form, setForm] = useState({ name: "", password: "" });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/auth/accept-invitation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, ...form }),
    });
    if (res.ok) {
      router.push("/admin/login");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to accept invitation");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl">Accept Invitation</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            className="border p-2 w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="border p-2 w-full"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white">
          Activate Account
        </button>
      </form>
    </div>
  );
}

