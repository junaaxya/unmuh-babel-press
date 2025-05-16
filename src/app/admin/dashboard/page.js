"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";




// Utility untuk membaca cookie
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
};

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Cek autentikasi
  useEffect(() => {
    // Cek token hanya di client-side
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin-token="))
      ?.split("=")[1];

    if (!token) {
      router.push("/admin/login");
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Konten utama
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Admin</h1>
        <p className="text-gray-600 dark:text-gray-400">Manajemen Konten HAKI</p>
      </header>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Buku" value="24" color="blue" icon="📚" />
        <StatCard title="Admin Aktif" value="3" color="green" icon="👤" />
        <StatCard title="Kategori" value="5" color="purple" icon="🏷️" />
      </div>

      {/* Tombol Logout */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            document.cookie = "admin-token=; Max-Age=0; path=/";
            router.push("/admin/login");
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

// Komponen StatCard terpisah
function StatCard({ title, value, color, icon }) {
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className={`${colorClasses[color]} p-6 rounded-lg shadow`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}
