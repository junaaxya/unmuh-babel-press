'use client';
import { useState } from 'react';
import ItemList from './ItemList';
import Modal from '@/components/ui/Modal';
import ItemForm from './ItemForm';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

const BeritaEvent = () => {
    const [activeTab, setActiveTab] = useState('berita');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [berita, setBerita] = useState([
        {
            id: 1,
            title: 'Rapat Pleno Buku Pedoman Penelitian & Pengabdian kepada Masyarakat',
            excerpt:
                'LPPMPP UNMUH Babel menggelar rapat pleno untuk finalisasi Buku Pedoman Penelitian dan Pengabdian kepada Masyarakat, sebagai panduan resmi implementasi Tri Dharma di lingkungan kampus.',
            image: '/images/news/rapat-pleno.jpeg',
            date: '2024-06-20',
            category: 'Berita',
            author: 'LPPMPP Unmuh Babel',
            slug: 'rapat-pleno-buku-pedoman-penelitian-pengabdian',
        },
    ]);

    const [event, setEvent] = useState([
        {
            id: 1,
            title: 'Sosialisasi KKN Kebangsaan Kemendikbudristek 2024',
            excerpt: 'Sosialisasi KKN Kebangsaan ke XII digelar pada Rabu, 29 Mei 2024 pukul 08.00 WIB. Kegiatan ini bertujuan menumbuhkan jiwa kebangsaan serta membangun pemberdayaan masyarakat.',
            image: '/images/events/sosialisasi.png',
            date: '2024-05-29',
            time: '08:00 - 10:30 WIB',
            location: 'Daring (Zoom Meeting)',
            category: 'Event',
            status: 'Completed',
            organizer: 'Kemendikbudristek & LPPMPP Unmuh Babel',
            slug: 'sosialisasi-kkn-kebangsaan-2024',
        },
    ]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleAddItem = () => {
        setCurrentItem(null);
        setIsModalOpen(true);
    };

    const handleEditItem = (item) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const handleDeleteItem = (item) => {
        setItemToDelete(item);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = () => {
        if (activeTab === 'berita') {
            setBerita(berita.filter((b) => b.id !== itemToDelete.id));
        } else {
            setEvent(event.filter((e) => e.id !== itemToDelete.id));
        }
        setIsConfirmModalOpen(false);
        setItemToDelete(null);
    };

    const handleSaveItem = (item) => {
        if (activeTab === 'berita') {
            if (item.id) {
                setBerita(berita.map((b) => (b.id === item.id ? item : b)));
            } else {
                setBerita([...berita, { ...item, id: Date.now() }]);
            }
        } else {
            if (item.id) {
                setEvent(event.map((e) => (e.id === item.id ? item : e)));
            } else {
                setEvent([...event, { ...item, id: Date.now() }]);
            }
        }
        setIsModalOpen(false);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Manajemen Berita & Event</h1>
                <button
                    onClick={handleAddItem}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Tambah {activeTab === 'berita' ? 'Berita' : 'Event'}
                </button>
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => handleTabChange('berita')}
                        className={`${
                            activeTab === 'berita'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Berita
                    </button>
                    <button
                        onClick={() => handleTabChange('event')}
                        className={`${
                            activeTab === 'event'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Event
                    </button>
                </nav>
            </div>

            <div className="mt-4">
                {activeTab === 'berita' ? (
                    <ItemList
                        items={berita}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                        itemType="berita"
                    />
                ) : (
                    <ItemList
                        items={event}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                        itemType="event"
                    />
                )}
            </div>

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <ItemForm
                        item={currentItem}
                        onSave={handleSaveItem}
                        onCancel={() => setIsModalOpen(false)}
                        itemType={activeTab}
                    />
                </Modal>
            )}

            {isConfirmModalOpen && (
                <ConfirmationModal
                    message={`Apakah Anda yakin ingin menghapus ${itemToDelete?.title}?`}
                    onConfirm={confirmDelete}
                    onCancel={() => setIsConfirmModalOpen(false)}
                />
            )}
        </div>
    );
};

export default BeritaEvent;
