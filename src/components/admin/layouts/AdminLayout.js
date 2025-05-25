"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faBook, faNewspaper, faUserEdit, faTags, faCog, faBars, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import AuthGuard from "../auth/AuthGuard";

const menuItems = [
  { title: "Dashboard", icon: faChartLine, path: "/admin/dashboard" },
  { title: "Buku", icon: faBook, path: "/admin/books" },
  { title: "Berita", icon: faNewspaper, path: "/admin/news" },
  { title: "Penulis", icon: faUserEdit, path: "/admin/authors" },
  { title: "Kategori", icon: faTags, path: "/admin/categories" },
  { title: "Pengaturan", icon: faCog, path: "/admin/settings" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem("adminToken");

      const response = await fetch("/api/admin/logout", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Redirect setelah response sukses
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout error:", error);
      alert("Gagal logout. Silakan coba lagi.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`
            fixed z-40 inset-y-0 left-0 w-64 bg-blue-800 text-white transform 
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            transition-transform duration-300 ease-in-out 
            md:relative md:translate-x-0 md:flex-shrink-0
          `}
        >
          <div className="p-4 text-xl font-bold border-b border-blue-700">UNMUH Press</div>
          <nav className="mt-4">
            <ul>
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link href={item.path} className={`flex items-center px-4 py-3 hover:bg-blue-700 ${pathname.startsWith(item.path) ? "bg-blue-700" : ""}`}>
                    <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                    <span className="ml-3">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="absolute bottom-0 w-full p-4 border-t border-blue-700">
            <button onClick={handleLogout} disabled={isLoggingOut} className="flex items-center w-full px-3 py-2 hover:bg-blue-700 rounded">
              <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
              <span className="ml-3">Keluar</span>
            </button>
          </div>
        </aside>

        {/* Overlay (Mobile) */}
        {sidebarOpen && <div className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden" onClick={toggleSidebar} />}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow h-16 flex items-center px-4 md:px-6">
            <button onClick={toggleSidebar} className="md:hidden mr-4 text-gray-700">
              <FontAwesomeIcon icon={faBars} />
            </button>
            <h1 className="text-lg font-semibold">{menuItems.find((m) => pathname.startsWith(m.path))?.title || "Admin"}</h1>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
