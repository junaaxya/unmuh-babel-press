'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faNewspaper,
  faCalendarAlt,
  faEdit,
  faClock,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

const typeIcons = {
  book: faBook,
  news: faNewspaper,
  event: faCalendarAlt,
};

function StatusBadge({ status }) {
  const statusClasses = {
    published: 'text-green-600 bg-green-100',
    draft: 'text-yellow-600 bg-yellow-100',
    updated: 'text-blue-600 bg-blue-100',
  };
  const cls = statusClasses[status] || 'text-gray-600 bg-gray-100';
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>{status}</span>
  );
}

function ActivityItem({ type, title, action, timestamp, status }) {
  const icon = typeIcons[type] || faEdit;
  return (
    <div className="flex items-center space-x-4 p-4">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
        <FontAwesomeIcon icon={icon} className="w-4 h-4 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        <p className="text-xs text-gray-500 flex items-center mt-1">
          <FontAwesomeIcon icon={faClock} className="w-3 h-3 mr-1" />
          {action === 'created' ? 'Dibuat' : 'Diperbarui'}{' '}
          {new Date(timestamp).toLocaleString('id-ID')}
        </p>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}

function ActivityList({ activities }) {
  if (!activities.length) {
    return (
      <p className="text-sm text-gray-500 p-4">Tidak ada aktivitas.</p>
    );
  }
  return (
    <div className="divide-y divide-gray-200">
      {activities.map((a) => (
        <ActivityItem key={`${a.type}-${a.id}-${a.timestamp}`} {...a} />
      ))}
    </div>
  );
}

export default function ActivitiesPageClient() {
  const [activities, setActivities] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filter]);

  const loadActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (filter !== 'all') params.append('type', filter);
      if (search) params.append('q', search);
      const res = await fetch(`/api/admin/activities?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch activities');
      const data = await res.json();
      setActivities(data.activities);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError('Gagal memuat aktivitas');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadActivities();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Semua Aktivitas</h1>
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <FontAwesomeIcon icon={faSearch} className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="Cari aktivitas..."
          />
        </div>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">Semua Tipe</option>
          <option value="book">Buku</option>
          <option value="news">Berita</option>
          <option value="event">Event</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          Cari
        </button>
      </form>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <p className="text-red-600 p-4">{error}</p>
        ) : (
          <ActivityList activities={activities} />
        )}
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 disabled:opacity-50"
        >
          Sebelumnya
        </button>
        <span className="text-sm text-gray-600">
          Halaman {page} dari {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 disabled:opacity-50"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
}

