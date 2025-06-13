
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faBook,
  faNewspaper,
  faCalendarAlt,
  faHome,
  faUser,
  faServicestack,
  faEnvelope,
  faBars,
  faSignOutAlt,
  faCog,
  faChevronDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import AuthGuard from '../auth/AuthGuard';

const MENU_ITEMS = [
  {
    title: 'Dashboard',
    icon: faChartLine,
    path: '/admin/dashboard',
    single: true,
  },
  {
    title: 'Konten Website',
    icon: faHome,
    submenu: [
      { title: 'Beranda', path: '/admin/dashboard/beranda' },
      { title: 'Profil', path: '/admin/dashboard/profil' },
      { title: 'Layanan', path: '/admin/dashboard/layanan' },
      { title: 'Kontak', path: '/admin/dashboard/kontak' },
    ],
  },
  {
    title: 'Katalog & Publikasi',
    icon: faBook,
    submenu: [
      { title: 'Katalog Buku', path: '/admin/dashboard/katalog' },
      { title: 'Penulis', path: '/admin/dashboard/penulis' },
      { title: 'Kategori', path: '/admin/dashboard/kategori' },
    ],
  },
  {
    title: 'Berita & Event',
    icon: faNewspaper,
    submenu: [
      { title: 'Berita', path: '/admin/dashboard/berita' },
      { title: 'Event', path: '/admin/dashboard/event' },
    ],
  },
  {
    title: 'Navigasi',
    icon: faBars,
    submenu: [
      { title: 'Menu Navbar', path: '/admin/dashboard/navbar' },
      { title: 'Submenu', path: '/admin/dashboard/navbar/submenu' },
    ],
  },
  {
    title: 'Pengaturan',
    icon: faCog,
    path: '/admin/dashboard/settings',
    single: true,
  },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const toggleSubmenu = (index) => {
    setExpandedMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem('adminToken');
      const res = await fetch('/api/admin/logout', {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Logout failed');

      window.location.href = '/admin/login';
    } catch (err) {
      console.error(err);
      alert('Gagal logout. Silakan coba lagi.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    MENU_ITEMS.forEach((item, index) => {
      if (item.submenu && item.submenu.some((sub) => pathname.startsWith(sub.path))) {
        setExpandedMenus((prev) => ({ ...prev, [index]: true }));
      }
    });
  }, [pathname]);

  const getCurrentPageTitle = () => {
    for (const item of MENU_ITEMS) {
      if (item.single && pathname.startsWith(item.path)) return item.title;
      if (item.submenu) {
        const subItem = item.submenu.find((sub) => pathname.startsWith(sub.path));
        if (subItem) return `${item.title} - ${subItem.title}`;
      }
    }
    return 'Admin Dashboard';
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex bg-gray-50">
        {/* Sidebar */}
        <aside
          className={`fixed z-40 inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex-shrink-0 shadow-xl`}
        >
          <div className="p-6 border-b border-blue-700/50 text-center">
            <div className="text-xl font-bold">
              <div className="bg-white text-blue-800 rounded-lg p-2 mb-2 inline-block">
                <FontAwesomeIcon icon={faBook} className="w-6 h-6" />
              </div>
              <div>UNMUH Press</div>
              <div className="text-xs text-blue-200 mt-1">Admin Dashboard</div>
            </div>
          </div>

          <nav className="mt-4 px-3 space-y-1">
            {MENU_ITEMS.map((item, index) => (
              <div key={index}>
                {item.single ? (
                  <Link
                    href={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-700/50 ${
                      pathname === item.path ? 'bg-blue-700 shadow-lg' : ''
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                    <span className="ml-3 font-medium">{item.title}</span>
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => toggleSubmenu(index)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-700/50 ${
                        item.submenu.some((sub) => pathname.startsWith(sub.path))
                          ? 'bg-blue-700/30'
                          : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                        <span className="ml-3 font-medium">{item.title}</span>
                      </div>
                      <FontAwesomeIcon
                        icon={expandedMenus[index] ? faChevronDown : faChevronRight}
                        className="w-3 h-3"
                      />
                    </button>
                    <div
                      className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                        expandedMenus[index] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      {item.submenu.map((sub, i) => (
                        <Link
                          key={i}
                          href={sub.path}
                          className={`flex items-center px-4 py-2 ml-6 rounded-lg text-sm transition-all duration-200 hover:bg-blue-600/30 ${
                            pathname.startsWith(sub.path)
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-blue-100'
                          }`}
                        >
                          <div className="w-2 h-2 bg-current rounded-full mr-3 opacity-60" />
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </nav>

          <div className="absolute bottom-0 w-full p-4 border-t border-blue-700/50">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 hover:bg-red-600/20 rounded-lg transition-all duration-200 text-red-200 hover:text-white"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
              <span className="ml-3 font-medium">Keluar</span>
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-4 md:px-6">
            <button
              onClick={toggleSidebar}
              className="md:hidden mr-4 text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-800">
                {getCurrentPageTitle()}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Kelola konten dan pengaturan website Unmuh Press
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Selamat datang, <span className="font-medium">Admin</span>
              </span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-white" />
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto bg-gray-50">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}