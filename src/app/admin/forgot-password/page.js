"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Lupa Password - Unmuh Press",
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // { type: 'error' | 'success', message: string }
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: data.error || "Terjadi kesalahan" });
      } else {
        setStatus({ type: "success", message: "Jika email terdaftar, tautan reset telah dikirim." });
        setEmail("");
      }
    } catch (err) {
      setStatus({ type: "error", message: "Terjadi kesalahan" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="w-full max-w-md bg-white/80 backdrop-blur p-8 rounded-2xl shadow-xl border border-indigo-100">
        <div className="flex flex-col items-center mb-6 text-indigo-700">
          <Mail className="h-12 w-12" />
          <h2 className="mt-2 text-2xl font-semibold">Lupa Password</h2>
          <p className="mt-1 text-center text-sm">
            Masukkan email anda untuk menerima tautan reset password.
          </p>
        </div>

        {status?.type === "error" && (
          <div className="mb-4 rounded bg-red-100 border border-red-400 px-4 py-3 text-red-700">
            {status.message}
          </div>
        )}
        {status?.type === "success" && (
          <div className="mb-4 rounded bg-green-100 border border-green-400 px-4 py-3 text-green-700">
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-indigo-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-indigo-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="alamat@email.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Mengirim..." : "Kirim Tautan Reset"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}

