'use client';

import { useEffect, useState } from "react";
import StatisticsCard from "@/components/admin/dashboard/StatisticsCard";
import DashboardCard from "@/components/admin/dashboard/DashboardCard";

export default function Dashboard() {
  const [statsData, setStatsData] = useState({
    totalBooks: 0,
    totalAuthors: 0,
    totalNews: 0,
    totalVisitors: 0,
    recentBooks: [],
    recentNews: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulasi API
        const data = {
          totalBooks: 156,
          totalAuthors: 42,
          totalNews: 78,
          totalVisitors: 1250,
          recentBooks: [
            { id: 1, title: "Filsafat Pendidikan Islam", author: "Dr. Ahmad Syafi'i", publishDate: "2023-04-15" },
            { id: 2, title: "Metode Penelitian Kualitatif", author: "Prof. Suharsimi", publishDate: "2023-05-22" },
            { id: 3, title: "Ekonomi Makro", author: "Dr. Bambang Supriyadi", publishDate: "2023-06-10" },
          ],
          recentNews: [
            { id: 1, title: "Peluncuran Buku Terbaru", date: "2023-07-01", views: 120 },
            { id: 2, title: "Seminar Nasional Pendidikan", date: "2023-06-28", views: 195 },
            { id: 3, title: "Workshop Penulisan Karya Ilmiah", date: "2023-06-25", views: 87 },
          ]
        };

        setStatsData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-600">Selamat datang di panel admin Unmuh Press</p>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatisticsCard title="Total Buku" value={statsData.totalBooks} icon="fa-book" color="blue" />
            <StatisticsCard title="Total Penulis" value={statsData.totalAuthors} icon="fa-user-edit" color="green" />
            <StatisticsCard title="Total Berita" value={statsData.totalNews} icon="fa-newspaper" color="yellow" />
            <StatisticsCard title="Pengunjung Bulan Ini" value={statsData.totalVisitors} icon="fa-users" color="purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard title="Buku Terbaru">
              <div className="divide-y">
                {statsData.recentBooks.map(book => (
                  <div key={book.id} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium">{book.title}</p>
                      <p className="text-sm text-gray-500">{book.author}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(book.publishDate).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <a href="/admin/books" className="text-blue-600 hover:underline text-sm flex items-center">
                  Lihat semua buku <i className="fas fa-arrow-right ml-1"></i>
                </a>
              </div>
            </DashboardCard>

            <DashboardCard title="Berita Terbaru">
              <div className="divide-y">
                {statsData.recentNews.map(news => (
                  <div key={news.id} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium">{news.title}</p>
                      <p className="text-sm text-gray-500">
                        <i className="fas fa-eye mr-1"></i> {news.views} views
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(news.date).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <a href="/admin/news" className="text-blue-600 hover:underline text-sm flex items-center">
                  Lihat semua berita <i className="fas fa-arrow-right ml-1"></i>
                </a>
              </div>
            </DashboardCard>
          </div>
        </>
      )}
    </div>
  );
}
