'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';

const titleMap = {
  '/admin/dashboard': 'Dashboard',
  '/admin/books': 'Buku',
  '/admin/news': 'Berita',
  '/admin/authors': 'Penulis',
  '/admin/categories': 'Kategori',
  '/admin/settings': 'Pengaturan',
};

const AdminHeader = ({ isMobile, toggleSidebar }) => {
  const pathname = usePathname();
  const title = Object.keys(titleMap).find((path) => pathname.startsWith(path));

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10 h-16 flex items-center px-4">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center space-x-4">
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="Toggle Sidebar"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-800">
            {titleMap[title] || 'Admin Dashboard'}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-full hover:bg-gray-100" aria-label="Notifikasi">
            <FontAwesomeIcon icon={faBell} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <span className="hidden md:inline text-gray-700 font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
