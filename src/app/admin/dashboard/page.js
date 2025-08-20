'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faNewspaper,
  faCalendarAlt,
  faEye,
  faArrowUp,
  faArrowDown,
  faEdit,
  faChartLine,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

// Components
const StatsCard = ({ title, value, icon, trend, trendValue, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-500 bg-blue-50',
    green: 'bg-green-500 text-green-500 bg-green-50',
    yellow: 'bg-yellow-500 text-yellow-500 bg-yellow-50',
    red: 'bg-red-500 text-red-500 bg-red-50',
    purple: 'bg-purple-500 text-purple-500 bg-purple-50',
    indigo: 'bg-indigo-500 text-indigo-500 bg-indigo-50',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <FontAwesomeIcon 
                icon={trend === 'up' ? faArrowUp : faArrowDown} 
                className={`w-3 h-3 mr-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}
              />
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trendValue}% dari bulan lalu
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color].split(' ')[2]} flex items-center justify-center`}>
          <FontAwesomeIcon icon={icon} className={`w-6 h-6 ${colorClasses[color].split(' ')[1]}`} />
        </div>
      </div>
    </div>
  );
};

const QuickActionCard = ({ title, description, icon, href, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    yellow: 'bg-yellow-600 hover:bg-yellow-700',
    red: 'bg-red-600 hover:bg-red-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    indigo: 'bg-indigo-600 hover:bg-indigo-700',
  };

  return (
    <Link href={href}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group cursor-pointer">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
            <FontAwesomeIcon icon={icon} className="w-6 h-6 text-white" />
          </div>
          <FontAwesomeIcon icon={faArrowUp} className="w-4 h-4 text-gray-400 transform rotate-45 group-hover:text-gray-600 transition-colors duration-200" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
};

const RecentActivityItem = ({ type, title, time, status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'updated': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'book': return faBook;
      case 'news': return faNewspaper;
      case 'event': return faCalendarAlt;
      default: return faEdit;
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
        <FontAwesomeIcon icon={getTypeIcon(type)} className="w-4 h-4 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        <p className="text-xs text-gray-500 flex items-center mt-1">
          <FontAwesomeIcon icon={faClock} className="w-3 h-3 mr-1" />
          {time}
        </p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        {status}
      </span>
    </div>
  );
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const role = session?.user?.role || 'VIEWER';
  const canEdit = role === 'ADMIN' || role === 'EDITOR';
  const [stats, setStats] = useState({
    books: 0,
    news: 0,
    events: 0,
    visitors: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls - replace with actual API endpoints
      const [booksRes, newsRes, eventsRes] = await Promise.all([
        fetch('/api/books/search'),
        fetch('/api/berita/search'),
        // fetch('/api/events/search'), // Uncomment when API is ready
      ]);

      const booksData = await booksRes.json();
      const newsData = await newsRes.json();

      setStats({
        books: booksData.data?.length || 0,
        news: newsData.data?.length || 0,
        events: 5, // Placeholder
        visitors: 1250, // Placeholder
      });

      // Mock recent activity data
      setRecentActivity([
        { type: 'book', title: 'Buku Metodologi Penelitian', time: '2 jam yang lalu', status: 'published' },
        { type: 'news', title: 'Peluncuran Program Studi Baru', time: '4 jam yang lalu', status: 'draft' },
        { type: 'event', title: 'Seminar Nasional Pendidikan', time: '1 hari yang lalu', status: 'published' },
        { type: 'book', title: 'Manajemen Keuangan Modern', time: '2 hari yang lalu', status: 'updated' },
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Selamat Datang di Dashboard
              {role === 'VIEWER' && (
                <span className="ml-2 text-sm font-normal bg-white/20 text-white px-2 py-1 rounded">
                  Read-only
                </span>
              )}
            </h1>
            <p className="text-blue-100 text-lg">
              Kelola seluruh konten website Unmuh Press dari satu tempat
            </p>
          </div>
          <div className="hidden md:block">
            <FontAwesomeIcon icon={faChartLine} className="w-20 h-20 text-blue-300 opacity-50" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Buku"
          value={stats.books}
          icon={faBook}
          trend="up"
          trendValue="12"
          color="blue"
        />
        <StatsCard
          title="Berita Aktif"
          value={stats.news}
          icon={faNewspaper}
          trend="up"
          trendValue="8"
          color="green"
        />
        <StatsCard
          title="Event Mendatang"
          value={stats.events}
          icon={faCalendarAlt}
          trend="down"
          trendValue="3"
          color="yellow"
        />
        <StatsCard
          title="Pengunjung Bulan Ini"
          value={stats.visitors.toLocaleString()}
          icon={faEye}
          trend="up"
          trendValue="24"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        {canEdit && (
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Aksi Cepat</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <QuickActionCard
                title="Tambah Buku Baru"
                description="Upload dan kelola katalog buku terbaru"
                icon={faBook}
                href="/admin/dashboard/catalog"
                color="blue"
              />
              <QuickActionCard
                title="Buat Berita"
                description="Publikasikan berita dan artikel terbaru"
                icon={faNewspaper}
                href="/admin/dashboard/berita"
                color="green"
              />
              <QuickActionCard
                title="Jadwalkan Event"
                description="Buat dan kelola event mendatang"
                icon={faCalendarAlt}
                href="/admin/dashboard/event"
                color="yellow"
              />
              <QuickActionCard
                title="Edit Beranda"
                description="Perbarui konten halaman utama"
                icon={faEdit}
                href="/admin/dashboard/beranda"
                color="purple"
              />
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Aktivitas Terbaru</h2>
            <Link href="/admin/dashboard/activity" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Lihat Semua
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity, index) => (
                <RecentActivityItem key={index} {...activity} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Management Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Kelola Konten Website</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Beranda', path: '/admin/dashboard/beranda', desc: 'Hero section dan konten utama' },
            { title: 'Profil', path: '/admin/dashboard/profil', desc: 'Tentang universitas dan visi misi' },
            { title: 'Layanan', path: '/admin/dashboard/layanan', desc: 'Layanan yang ditawarkan' },
            { title: 'Kontak', path: '/admin/dashboard/kontak', desc: 'Informasi kontak dan alamat' },
            { title: 'Pengaturan', path: '/admin/dashboard/settings', desc: 'Konfigurasi website', minRole: 'EDITOR' },
          ]
            .filter((item) => canEdit || !item.minRole)
            .map((item, index) => {
              const content = (
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer group">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                </div>
              );
              return canEdit ? (
                <Link key={index} href={item.path}>
                  {content}
                </Link>
              ) : (
                <div key={index} className="opacity-60 cursor-not-allowed">
                  {content}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}