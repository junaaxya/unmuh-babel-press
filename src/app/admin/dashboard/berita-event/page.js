'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layouts/AdminLayout';
import NewsEventTable from '@/components/admin/berita-event/NewsEventTable';
import NewsEventForm from '@/components/admin/berita-event/NewsEventForm';
import SearchFilter from '@/components/admin/berita-event/SearchFilter';
import Modal from '@/components/ui/Modal/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal/ConfirmationModal';
import Notification from '@/components/ui/Notification/Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faNewspaper, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

// Import data dummy
import {newsData} from '@/data/news.js';
import {eventData} from '@/data/event.js';

export default function BeritaEventPage() {
  // State management
  const [activeTab, setActiveTab] = useState('berita');
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [notification, setNotification] = useState(null);

  // Load dummy data
  useEffect(() => {
    setNews(newsData);
    setEvents(eventData);
  }, []);

  // Get current data based on active tab
  const getCurrentData = () => {
    return activeTab === 'berita' ? news : events;
  };

  // Filter data based on search and filters
  const getFilteredData = () => {
    let data = getCurrentData();
    
    // Search filter
    if (searchTerm) {
      data = data.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      data = data.filter(item => item.category === selectedCategory);
    }

    // Status filter (only for events)
    if (selectedStatus && activeTab === 'event') {
      data = data.filter(item => item.status === selectedStatus);
    }

    return data;
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle add new item
  const handleAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  // Handle edit item
  const handleEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  // Handle delete item
  const handleDelete = (item) => {
    setDeletingItem(item);
    setIsConfirmDeleteOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (activeTab === 'berita') {
      setNews(prev => prev.filter(item => item.id !== deletingItem.id));
    } else {
      setEvents(prev => prev.filter(item => item.id !== deletingItem.id));
    }
    
    setIsConfirmDeleteOpen(false);
    setDeletingItem(null);
    showNotification(`${activeTab === 'berita' ? 'Berita' : 'Event'} berhasil dihapus!`);
  };

  // Handle form submit
  const handleFormSubmit = (formData) => {
    if (editingItem) {
      // Update existing item
      if (activeTab === 'berita') {
        setNews(prev => prev.map(item => 
          item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
        ));
      } else {
        setEvents(prev => prev.map(item => 
          item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
        ));
      }
      showNotification(`${activeTab === 'berita' ? 'Berita' : 'Event'} berhasil diperbarui!`);
    } else {
      // Add new item
      const newId = Math.max(...getCurrentData().map(item => item.id), 0) + 1;
      const newItem = { ...formData, id: newId };
      
      if (activeTab === 'berita') {
        setNews(prev => [newItem, ...prev]);
      } else {
        setEvents(prev => [newItem, ...prev]);
      }
      showNotification(`${activeTab === 'berita' ? 'Berita' : 'Event'} berhasil ditambahkan!`);
    }
    
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Kelola Berita & Event
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Kelola konten berita dan event UnmuhBabelPress
            </p>
          </div>
          
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
            Tambah {activeTab === 'berita' ? 'Berita' : 'Event'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FontAwesomeIcon icon={faNewspaper} className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Berita</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{news.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <FontAwesomeIcon icon={faCalendarAlt} className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Event</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{events.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('berita')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'berita'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <FontAwesomeIcon icon={faNewspaper} className="w-4 h-4 mr-2" />
                Berita ({news.length})
              </button>
              <button
                onClick={() => setActiveTab('event')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'event'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-2" />
                Event ({events.length})
              </button>
            </nav>
          </div>

          {/* Search and Filter */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              activeTab={activeTab}
            />
          </div>

          {/* Table */}
          <div className="p-6">
            <NewsEventTable
              data={getFilteredData()}
              type={activeTab}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>

        {/* Form Modal */}
        <Modal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingItem(null);
          }}
          title={`${editingItem ? 'Edit' : 'Tambah'} ${activeTab === 'berita' ? 'Berita' : 'Event'}`}
          size="lg"
        >
          <NewsEventForm
            type={activeTab}
            initialData={editingItem}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingItem(null);
            }}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isConfirmDeleteOpen}
          onClose={() => {
            setIsConfirmDeleteOpen(false);
            setDeletingItem(null);
          }}
          onConfirm={confirmDelete}
          title="Konfirmasi Hapus"
          message={`Apakah Anda yakin ingin menghapus ${activeTab === 'berita' ? 'berita' : 'event'} "${deletingItem?.title}"?`}
          type="danger"
        />

        {/* Notification */}
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    
  );
}