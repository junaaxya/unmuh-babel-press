'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faBook,
  faNewspaper,
  faUserEdit,
  faTags,
  faCog,
  faChevronLeft,
  faChevronRight,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

const menuItems = [
  { title: 'Dashboard', icon: faChartLine, path: '/admin/dashboard' },
  { title: 'Buku', icon: faBook, path: '/admin/books' },
  { title: 'Berita', icon: faNewspaper, path: '/admin/news' },
  { title: 'Penulis', icon: faUserEdit, path: '/admin/authors' },
  { title: 'Kategori', icon: faTags, path: '/admin/categories' },
  { title: 'Pengaturan', icon: faCog, path: '/admin/settings' },
];

const Sidebar = ({ isOpen, isMobile, toggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  return (
    <aside
      className={`bg-blue-800 text-white fixed md:relative h-screen z-20 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      } ${!isOpen && isMobile ? 'hidden' : ''}`}
    >
      <div className="flex items-center justify-between p-4 h-16">
        {isOpen && <h2 className="text-xl font-bold">UNMUH Press</h2>}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-blue-700 rounded-md"
          aria-label="Toggle Sidebar"
        >
          <FontAwesomeIcon icon={isOpen ? faChevronLeft : faChevronRight} />
        </button>
      </div>

      <nav className="mt-4 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center p-3 rounded-md transition-colors ${
                  pathname.startsWith(item.path)
                    ? 'bg-blue-700'
                    : 'hover:bg-blue-700'
                } ${isOpen ? '' : 'justify-center'}`}
              >
                <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                {isOpen && <span className="ml-3 whitespace-nowrap">{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-0 right-0 px-4">
        <button
          onClick={handleLogout}
          className={`flex items-center p-3 rounded-md hover:bg-blue-700 w-full ${
            isOpen ? '' : 'justify-center'
          }`}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
          {isOpen && <span className="ml-3">Keluar</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
