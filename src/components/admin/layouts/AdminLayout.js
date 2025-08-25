'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faBook,
  faNewspaper,
  faCalendarAlt,
  faHome,
  faServicestack,
  faEnvelope,
  faBars,
  faSignOutAlt,
  faCog,
  faChevronDown,
  faChevronRight,
  faTimes,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

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
      { title: 'Katalog Buku', path: '/admin/dashboard/catalog' },
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
    submenu: [
      { title: 'Akun Saya', path: '/admin/dashboard/settings/account' },
      { title: 'Pengaturan Situs', path: '/admin/dashboard/settings', minRole: 'EDITOR' },
    ],
  },
  {
    title: 'Users',
    icon: faUsers,
    path: '/admin/dashboard/users',
    single: true,
    minRole: 'ADMIN',
  },
];

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const role = session?.user?.role || 'VIEWER';
    const roleRank = { VIEWER: 0, EDITOR: 1, ADMIN: 2 };
    const visibleMenu = MENU_ITEMS.filter(
        (item) => !item.minRole || roleRank[role] >= roleRank[item.minRole]
    );
    const [sidebarOpen, setSidebarOpen] = useState(true); // Default open for desktop
    const [expandedMenus, setExpandedMenus] = useState({});
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // 1. Deteksi ukuran layar (mobile vs desktop)
    useEffect(() => {
        const checkIsMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
        };
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    // di dalam component, tambahkan:
    const prevIsMobileRef = useRef(isMobile);

    useEffect(() => {
        const prevIsMobile = prevIsMobileRef.current;

        // Kalau berubah dari desktop ke mobile: tutup sidebar
        if (!prevIsMobile && isMobile) {
            setSidebarOpen(false);
        }
        // Kalau berubah dari mobile ke desktop: buka sidebar
        else if (prevIsMobile && !isMobile) {
            setSidebarOpen(true);
        }

        prevIsMobileRef.current = isMobile;
    }, [isMobile]);

    // Close sidebar when clicking on link in mobile only
    useEffect(() => {
        if (isMobile && sidebarOpen) {
            setSidebarOpen(false);
        }
        // PERBAIKAN: Menambahkan comment di bawah ini untuk menonaktifkan peringatan ESLint
        // Kita sengaja tidak menambahkan `sidebarOpen` sebagai dependensi untuk menghindari bug
        // di mana sidebar akan langsung tertutup setelah dibuka secara manual.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, isMobile]);

    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const toggleSubmenu = (index) => {
        setExpandedMenus((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await signOut({ callbackUrl: '/admin/login' });
        } catch (err) {
            console.error(err);
            alert('Gagal logout. Silakan coba lagi.');
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Auto-expand menus based on current path
    useEffect(() => {
        visibleMenu.forEach((item, index) => {
            if (
                item.submenu &&
                item.submenu.some((sub) => pathname.startsWith(sub.path))
            ) {
                setExpandedMenus((prev) => ({ ...prev, [index]: true }));
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, role]);

    const getCurrentPageTitle = () => {
        for (const item of MENU_ITEMS) {
            if (item.single && pathname.startsWith(item.path))
                return item.title;
            if (item.submenu) {
                const subItem = item.submenu.find((sub) =>
                    pathname.startsWith(sub.path)
                );
                if (subItem) return `${item.title} - ${subItem.title}`;
            }
        }
        return 'Admin Dashboard';
    };

    const handleMenuItemClick = (item) => {
        // Close sidebar on mobile when clicking single menu item
        if (isMobile && item.single) {
            setSidebarOpen(false);
        }
    };

    const handleSubmenuItemClick = () => {
        // Close sidebar on mobile when clicking submenu item
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Backdrop Overlay for Mobile */}
            {sidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity duration-300"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`${
                    isMobile
                        ? `fixed z-40 inset-y-0 left-0 w-64 transform ${
                              sidebarOpen
                                  ? 'translate-x-0'
                                  : '-translate-x-full'
                          } transition-transform duration-300 ease-in-out`
                        : `${
                              sidebarOpen ? 'w-64' : 'w-16'
                          } transition-all duration-300 ease-in-out flex-shrink-0`
                } bg-gradient-to-b from-blue-800 to-blue-900 text-white shadow-xl`}
            >
                {/* Sidebar Header */}
                <div
                    className={`p-6 border-b border-blue-700/50 ${
                        !sidebarOpen && !isMobile ? 'px-2' : ''
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div
                            className={`text-center flex-1 ${
                                !sidebarOpen && !isMobile ? 'hidden' : ''
                            }`}
                        >
                            <div className="bg-white text-blue-800 rounded-lg p-2 mb-2 inline-block">
                                <FontAwesomeIcon
                                    icon={faBook}
                                    className="w-6 h-6"
                                />
                            </div>
                            <div className="text-xl font-bold">UNMUH PRESS</div>
                            <div className="text-xs text-blue-200 mt-1">
                                Admin Dashboard
                            </div>
                        </div>

                        {/* Collapsed logo for desktop */}
                        {!sidebarOpen && !isMobile && (
                            <div className="w-full flex justify-center">
                                <div className="bg-white text-blue-800 rounded-lg p-2">
                                    <FontAwesomeIcon
                                        icon={faBook}
                                        className="w-6 h-6"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Close button for mobile */}
                        {isMobile && (
                            <button
                                onClick={closeSidebar}
                                className="ml-4 p-2 rounded-lg hover:bg-blue-700/50 transition-colors duration-200"
                                aria-label="Close sidebar"
                            >
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    className="w-5 h-5"
                                />
                            </button>
                        )}
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="mt-4 px-3 space-y-1 flex-1 overflow-x-hidden">
                    {visibleMenu.map((item, index) => (
                        <div key={index}>
                            {item.single ? (
                                <Link
                                    href={item.path}
                                    onClick={() => handleMenuItemClick(item)}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-700/50 group relative ${
                                        pathname === item.path
                                            ? 'bg-blue-700 shadow-lg'
                                            : ''
                                    } ${
                                        !sidebarOpen && !isMobile
                                            ? 'justify-center px-2'
                                            : ''
                                    }`}
                                    title={
                                        !sidebarOpen && !isMobile
                                            ? item.title
                                            : ''
                                    }
                                >
                                    <FontAwesomeIcon
                                        icon={item.icon}
                                        className="w-5 h-5 group-hover:scale-110 transition-transform duration-200 flex-shrink-0"
                                    />
                                    <span
                                        className={`ml-3 font-medium transition-opacity duration-200 ${
                                            !sidebarOpen && !isMobile
                                                ? 'opacity-0 w-0 overflow-hidden'
                                                : 'opacity-100'
                                        }`}
                                    >
                                        {item.title}
                                    </span>

                                    {/* Tooltip for collapsed state */}
                                    {!sidebarOpen && !isMobile && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                                            {item.title}
                                        </div>
                                    )}
                                </Link>
                            ) : (
                                <>
                                    <button
                                        onClick={() => toggleSubmenu(index)}
                                        className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-700/50 group relative ${
                                            item.submenu.some((sub) =>
                                                pathname.startsWith(sub.path)
                                            )
                                                ? 'bg-blue-700/30'
                                                : ''
                                        } ${
                                            !sidebarOpen && !isMobile
                                                ? 'justify-center px-2'
                                                : ''
                                        }`}
                                        title={
                                            !sidebarOpen && !isMobile
                                                ? item.title
                                                : ''
                                        }
                                    >
                                        <div className="flex items-center">
                                            <FontAwesomeIcon
                                                icon={item.icon}
                                                className="w-5 h-5 group-hover:scale-110 transition-transform duration-200 flex-shrink-0"
                                            />
                                            <span
                                                className={`ml-3 font-medium transition-opacity duration-200 ${
                                                    !sidebarOpen && !isMobile
                                                        ? 'opacity-0 w-0 overflow-hidden'
                                                        : 'opacity-100'
                                                }`}
                                            >
                                                {item.title}
                                            </span>
                                        </div>

                                        {sidebarOpen || isMobile ? (
                                            <FontAwesomeIcon
                                                icon={
                                                    expandedMenus[index]
                                                        ? faChevronDown
                                                        : faChevronRight
                                                }
                                                className={`w-3 h-3 transition-transform duration-300 ${
                                                    expandedMenus[index]
                                                        ? 'rotate-180'
                                                        : ''
                                                }`}
                                            />
                                        ) : null}

                                        {/* Tooltip for collapsed state */}
                                        {!sidebarOpen && !isMobile && (
                                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                                                {item.title}
                                            </div>
                                        )}
                                    </button>

                    {/* Submenu */}
                    {(sidebarOpen || isMobile) && (
                      <div
                        className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                          expandedMenus[index]
                            ? 'max-h-96 opacity-100 transform translate-y-0'
                            : 'max-h-0 opacity-0 transform -translate-y-2'
                        }`}
                      >
                        {item.submenu
                          .filter(
                            (sub) => !sub.minRole || roleRank[role] >= roleRank[sub.minRole]
                          )
                          .map((sub, i) => (
                            <Link
                              key={i}
                              href={sub.path}
                              onClick={handleSubmenuItemClick}
                              className={`flex items-center px-4 py-2 ml-6 rounded-lg text-sm transition-all duration-200 hover:bg-blue-600/30 group ${
                                pathname.startsWith(sub.path)
                                  ? 'bg-blue-600 text-white shadow-md'
                                  : 'text-blue-100 hover:text-white'
                              }`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full mr-3 transition-all duration-200 ${
                                  pathname.startsWith(sub.path)
                                    ? 'bg-white'
                                    : 'bg-blue-300 group-hover:bg-white'
                                }`}
                              />
                              {sub.title}
                            </Link>
                          ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </nav>

                {/* Logout Button */}
                <div
                    className={`p-4 border-t border-blue-700/50 ${
                        !sidebarOpen && !isMobile ? 'px-2' : ''
                    }`}
                >
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                            isLoggingOut
                                ? 'bg-red-600/20 text-red-300 cursor-not-allowed'
                                : 'hover:bg-red-600/20 text-red-200 hover:text-white'
                        } ${
                            !sidebarOpen && !isMobile
                                ? 'justify-center px-2'
                                : ''
                        }`}
                        title={!sidebarOpen && !isMobile ? 'Keluar' : ''}
                    >
                        <FontAwesomeIcon
                            icon={faSignOutAlt}
                            className={`w-5 h-5 ${
                                isLoggingOut
                                    ? 'animate-spin'
                                    : 'group-hover:scale-110'
                            } transition-transform duration-200 flex-shrink-0`}
                        />
                        <span
                            className={`ml-3 font-medium transition-opacity duration-200 ${
                                !sidebarOpen && !isMobile
                                    ? 'opacity-0 w-0 overflow-hidden'
                                    : 'opacity-100'
                            }`}
                        >
                            {isLoggingOut ? 'Logging out...' : 'Keluar'}
                        </span>

                        {/* Tooltip for collapsed state */}
                        {!sidebarOpen && !isMobile && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                                Keluar
                            </div>
                        )}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 ">
                {/* Header */}
                <header className="bg-white shadow-sm border-b  border-gray-200 h-16 flex items-center px-4 md:px-6 sticky top-0 z-20">
                    {/* Hamburger Menu Button - Now visible on all screen sizes */}
                    <button
                        onClick={toggleSidebar}
                        className={`mr-4 p-2 rounded-lg transition-all duration-200 ${
                            sidebarOpen
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                    >
                        <FontAwesomeIcon
                            icon={sidebarOpen ? faTimes : faBars}
                            className="w-5 h-5 transition-transform duration-200"
                        />
                    </button>

                    {/* Page Title */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-semibold text-gray-800 truncate">
                            {getCurrentPageTitle()}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1 hidden sm:block">
                            Kelola konten dan pengaturan website Unmuh Press
                        </p>
                    </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                Selamat datang, <span className="font-medium">{session?.user?.name || 'Pengguna'}</span>
              </span>
              <Link href="/admin/dashboard/settings/account">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'avatar'}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-200 hover:ring-blue-300 transition-all duration-200"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center ring-2 ring-blue-200 hover:ring-blue-300 transition-all duration-200">
                    <span className="text-white text-sm font-medium">
                      {(session?.user?.name || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </Link>
            </div>
          </header>

                {/* Main Content Area */}
                <main className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}
