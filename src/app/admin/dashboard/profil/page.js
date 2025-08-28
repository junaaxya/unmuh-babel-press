'use client';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ImageUploader from '@/components/admin/berita-event/ImageUploader';
import Notification from '@/components/ui/Notification/Notification';
import {
    faUser,
    faEye,
    faHistory,
    faUsers,
    faCogs,
    faPlus,
    faTrash,
    faEdit,
    faSave,
    faTimes,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';

// Helper function untuk API request
async function apiRequest(url, method = 'GET', body = null) {
    const headers = {};
    if (body && typeof body !== 'string') {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(body);
    } else if (body && typeof body === 'string') {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, {
        method,
        headers,
        credentials: 'include',
        body: body || undefined,
    });

    if (!res.ok) {
        const errorData = await res
            .json()
            .catch(() => ({ message: 'Request failed' }));
        throw new Error(errorData.message || 'Request failed');
    }

    return res.json();
}

export default function AdminProfilPage() {
    const [activeTab, setActiveTab] = useState('hero');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({
        id: null,
        type: '',
        message: '',
    });

    // Hero Section State
    const [heroData, setHeroData] = useState({
        title: '',
        subtitle: '',
        description: '',
    });

    // Vision Mission State
    const [visionMissionData, setVisionMissionData] = useState({
        vision: '',
        missions: [],
    });

    // History State
    const [historyData, setHistoryData] = useState([]);

    // Team State
    const [teamData, setTeamData] = useState([]);

    // Services State
    const [servicesData, setServicesData] = useState([]);

    const tabs = [
        { id: 'hero', label: 'Hero Section', icon: faUser },
        { id: 'vision-mission', label: 'Visi & Misi', icon: faEye },
        { id: 'history', label: 'Sejarah', icon: faHistory },
        { id: 'team', label: 'Tim', icon: faUsers },
        { id: 'services', label: 'Layanan', icon: faCogs },
    ];

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        try {
            setLoading(true);
            let data;

            switch (activeTab) {
                case 'hero':
                    data = await apiRequest('/api/profile/hero');
                    const defaultHeroData = {
                        title: '',
                        subtitle: '',
                        description: '',
                    };
                    setHeroData({ ...defaultHeroData, ...(data.data || {}) });
                    break;
                case 'vision-mission':
                    data = await apiRequest('/api/profile/vision-mission');
                    setVisionMissionData(
                        data.data || { vision: '', missions: [] }
                    );
                    break;
                case 'history':
                    data = await apiRequest('/api/profile/history');
                    setHistoryData(data.data || []);
                    break;
                case 'team':
                    data = await apiRequest('/api/profile/team');
                    setTeamData(
                        (data.data || []).map((member) => ({
                            name: member.name || '',
                            description: member.position || '',
                            image: member.image || '',
                            order: member.order ?? 0,
                        }))
                    );
                    break;
                case 'services':
                    data = await apiRequest('/api/profile/services');
                    setServicesData(data.data || []);
                    break;
            }
        } catch (error) {
            setNotification({
                id: Date.now(),
                type: 'error',
                message: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ id: Date.now(), type, message });
    };

    // Hero Section Handlers
    const handleHeroSave = async () => {
        try {
            setLoading(true);
            await apiRequest('/api/profile/hero', 'PUT', heroData);
            showNotification('success', 'Hero section berhasil diperbarui');
        } catch (error) {
            showNotification('error', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Vision Mission Handlers
    const handleVisionMissionSave = async () => {
        try {
            setLoading(true);
            await apiRequest(
                '/api/profile/vision-mission',
                'PUT',
                visionMissionData
            );
            showNotification('success', 'Visi & Misi berhasil diperbarui');
        } catch (error) {
            showNotification('error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const addMission = () => {
        setVisionMissionData({
            ...visionMissionData,
            missions: [
                ...visionMissionData.missions,
                { text: '', order: visionMissionData.missions.length },
            ],
        });
    };

    const removeMission = (index) => {
        const newMissions = visionMissionData.missions.filter(
            (_, i) => i !== index
        );
        setVisionMissionData({ ...visionMissionData, missions: newMissions });
    };

    const updateMission = (index, text) => {
        const newMissions = [...visionMissionData.missions];
        newMissions[index] = { ...newMissions[index], text };
        setVisionMissionData({ ...visionMissionData, missions: newMissions });
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'hero':
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="mr-2 text-blue-600"
                                />
                                Hero Section
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Judul
                                    </label>
                                    <input
                                        type="text"
                                        value={heroData.title}
                                        onChange={(e) =>
                                            setHeroData({
                                                ...heroData,
                                                title: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Masukkan judul hero"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subtitle
                                    </label>
                                    <input
                                        type="text"
                                        value={heroData.subtitle}
                                        onChange={(e) =>
                                            setHeroData({
                                                ...heroData,
                                                subtitle: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Masukkan subtitle"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={heroData.description}
                                    onChange={(e) =>
                                        setHeroData({
                                            ...heroData,
                                            description: e.target.value,
                                        })
                                    }
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Masukkan deskripsi"
                                />
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={handleHeroSave}
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <FontAwesomeIcon
                                            icon={faSpinner}
                                            spin
                                            className="mr-2"
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={faSave}
                                            className="mr-2"
                                        />
                                    )}
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'vision-mission':
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <FontAwesomeIcon
                                    icon={faEye}
                                    className="mr-2 text-blue-600"
                                />
                                Visi & Misi
                            </h3>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Visi
                                </label>
                                <textarea
                                    value={visionMissionData.vision}
                                    onChange={(e) =>
                                        setVisionMissionData({
                                            ...visionMissionData,
                                            vision: e.target.value,
                                        })
                                    }
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Masukkan visi organisasi"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-md font-medium">
                                        Misi
                                    </h4>
                                    <button
                                        onClick={addMission}
                                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                    >
                                        <FontAwesomeIcon
                                            icon={faPlus}
                                            className="mr-1"
                                        />
                                        Tambah Misi
                                    </button>
                                </div>

                                {visionMissionData.missions.map(
                                    (mission, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-4 mb-4"
                                        >
                                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-medium">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <input
                                                type="text"
                                                value={mission.text}
                                                onChange={(e) =>
                                                    updateMission(
                                                        index,
                                                        e.target.value
                                                    )
                                                }
                                                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Masukkan misi"
                                            />
                                            <button
                                                onClick={() =>
                                                    removeMission(index)
                                                }
                                                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                />
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={handleVisionMissionSave}
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <FontAwesomeIcon
                                            icon={faSpinner}
                                            spin
                                            className="mr-2"
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={faSave}
                                            className="mr-2"
                                        />
                                    )}
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'history':
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold flex items-center">
                                    <FontAwesomeIcon
                                        icon={faHistory}
                                        className="mr-2 text-blue-600"
                                    />
                                    Sejarah
                                </h3>
                                <button
                                    onClick={() => addHistoryItem()}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                >
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        className="mr-1"
                                    />
                                    Tambah Sejarah
                                </button>
                            </div>

                            {historyData.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">
                                    Belum ada item sejarah yang ditambahkan
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {historyData.map((item, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-md p-4"
                                        >
                                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Tahun
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={item.year}
                                                        onChange={(e) =>
                                                            updateHistoryItem(
                                                                index,
                                                                'year',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="2024"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Judul
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={item.title}
                                                        onChange={(e) =>
                                                            updateHistoryItem(
                                                                index,
                                                                'title',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Judul peristiwa"
                                                    />
                                                </div>
                                                <div className="flex items-end">
                                                    <button
                                                        onClick={() =>
                                                            removeHistoryItem(
                                                                index
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTrash}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Deskripsi
                                                </label>
                                                <textarea
                                                    value={item.description}
                                                    onChange={(e) =>
                                                        updateHistoryItem(
                                                            index,
                                                            'description',
                                                            e.target.value
                                                        )
                                                    }
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Deskripsi peristiwa"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => handleSaveSection('history')}
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <FontAwesomeIcon
                                            icon={faSpinner}
                                            spin
                                            className="mr-2"
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={faSave}
                                            className="mr-2"
                                        />
                                    )}
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'team':
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold flex items-center">
                                    <FontAwesomeIcon
                                        icon={faUsers}
                                        className="mr-2 text-blue-600"
                                    />
                                    Tim
                                </h3>
                                <button
                                    onClick={() => addTeamMember()}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                >
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        className="mr-1"
                                    />
                                    Tambah Anggota
                                </button>
                            </div>

                            {teamData.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">
                                    Belum ada anggota tim yang ditambahkan
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {teamData.map((member, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-md p-4 space-y-4"
                                        >
                                            <div className="flex justify-between gap-4">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Nama
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={member.name || ''}
                                                        onChange={(e) =>
                                                            updateTeamMember(
                                                                index,
                                                                'name',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Nama lengkap"
                                                    />
                                                </div>
                                                <div className="flex items-end">
                                                    <button
                                                        onClick={() =>
                                                            removeTeamMember(index)
                                                        }
                                                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Foto
                                                </label>
                                                <ImageUploader
                                                    currentImage={member.image || ''}
                                                    onUpload={(url) =>
                                                        updateTeamMember(index, 'image', url)
                                                    }
                                                    folder="unmuh-babel/team"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Deskripsi/Jabatan
                                                </label>
                                                <textarea
                                                    value={member.description || ''}
                                                    onChange={(e) =>
                                                        updateTeamMember(
                                                            index,
                                                            'description',
                                                            e.target.value
                                                        )
                                                    }
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Jabatan atau deskripsi singkat"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => handleSaveSection('team')}
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <FontAwesomeIcon
                                            icon={faSpinner}
                                            spin
                                            className="mr-2"
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={faSave}
                                            className="mr-2"
                                        />
                                    )}
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'services':
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold flex items-center">
                                    <FontAwesomeIcon
                                        icon={faCogs}
                                        className="mr-2 text-blue-600"
                                    />
                                    Layanan
                                </h3>
                                <button
                                    onClick={() => addService()}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                >
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        className="mr-1"
                                    />
                                    Tambah Layanan
                                </button>
                            </div>

                            {servicesData.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">
                                    Belum ada layanan yang ditambahkan
                                </p>
                            ) : (
                                <div className="space-y-6">
                                    {servicesData.map((service, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-md p-4"
                                        >
                                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Nama Layanan
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={service.title}
                                                        onChange={(e) =>
                                                            updateService(
                                                                index,
                                                                'title',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Nama layanan"
                                                    />
                                                </div>
                                                <div className="flex items-end">
                                                    <button
                                                        onClick={() =>
                                                            removeService(index)
                                                        }
                                                        className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTrash}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Deskripsi
                                                </label>
                                                <textarea
                                                    value={service.description}
                                                    onChange={(e) =>
                                                        updateService(
                                                            index,
                                                            'description',
                                                            e.target.value
                                                        )
                                                    }
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Deskripsi layanan"
                                                />
                                            </div>

                                            {/* Features */}
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Fitur Layanan
                                                    </label>
                                                    <button
                                                        onClick={() =>
                                                            addServiceFeature(
                                                                index
                                                            )
                                                        }
                                                        className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faPlus}
                                                        />
                                                    </button>
                                                </div>
                                                <div className="space-y-2">
                                                    {(
                                                        service.features || []
                                                    ).map(
                                                        (
                                                            feature,
                                                            featureIndex
                                                        ) => (
                                                            <div
                                                                key={
                                                                    featureIndex
                                                                }
                                                                className="flex items-center space-x-2"
                                                            >
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        feature.text
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateServiceFeature(
                                                                            index,
                                                                            featureIndex,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    placeholder="Fitur layanan"
                                                                />
                                                                <button
                                                                    onClick={() =>
                                                                        removeServiceFeature(
                                                                            index,
                                                                            featureIndex
                                                                        )
                                                                    }
                                                                    className="px-2 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faTrash
                                                                        }
                                                                        className="text-xs"
                                                                    />
                                                                </button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() =>
                                        handleSaveSection('services')
                                    }
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <FontAwesomeIcon
                                            icon={faSpinner}
                                            spin
                                            className="mr-2"
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={faSave}
                                            className="mr-2"
                                        />
                                    )}
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <p className="text-gray-500">
                            Fitur {activeTab} akan segera tersedia.
                        </p>
                    </div>
                );
        }
    };

    // History handlers
    const addHistoryItem = () => {
        setHistoryData([
            ...historyData,
            {
                year: '',
                title: '',
                description: '',
                order: historyData.length,
            },
        ]);
    };

    const removeHistoryItem = (index) => {
        const newHistory = historyData.filter((_, i) => i !== index);
        setHistoryData(newHistory);
    };

    const updateHistoryItem = (index, field, value) => {
        const newHistory = [...historyData];
        newHistory[index] = { ...newHistory[index], [field]: value };
        setHistoryData(newHistory);
    };

    // Team handlers
    const addTeamMember = () => {
        setTeamData([
            ...teamData,
            {
                name: '',
                description: '',
                image: '',
                order: teamData.length,
            },
        ]);
    };

    const removeTeamMember = (index) => {
        const newTeam = teamData.filter((_, i) => i !== index);
        setTeamData(newTeam);
    };

    const updateTeamMember = (index, field, value) => {
        const newTeam = [...teamData];
        newTeam[index] = { ...newTeam[index], [field]: value };
        setTeamData(newTeam);
    };

    // Services handlers
    const addService = () => {
        setServicesData([
            ...servicesData,
            {
                title: '',
                description: '',
                features: [],
                order: servicesData.length,
            },
        ]);
    };

    const removeService = (index) => {
        const newServices = servicesData.filter((_, i) => i !== index);
        setServicesData(newServices);
    };

    const updateService = (index, field, value) => {
        const newServices = [...servicesData];
        newServices[index] = { ...newServices[index], [field]: value };
        setServicesData(newServices);
    };

    const addServiceFeature = (serviceIndex) => {
        const newServices = [...servicesData];
        if (!newServices[serviceIndex].features) {
            newServices[serviceIndex].features = [];
        }
        newServices[serviceIndex].features.push({
            text: '',
            order: newServices[serviceIndex].features.length,
        });
        setServicesData(newServices);
    };

    const removeServiceFeature = (serviceIndex, featureIndex) => {
        const newServices = [...servicesData];
        newServices[serviceIndex].features = newServices[
            serviceIndex
        ].features.filter((_, i) => i !== featureIndex);
        setServicesData(newServices);
    };

    const updateServiceFeature = (serviceIndex, featureIndex, value) => {
        const newServices = [...servicesData];
        newServices[serviceIndex].features[featureIndex] = {
            ...newServices[serviceIndex].features[featureIndex],
            text: value,
        };
        setServicesData(newServices);
    };

    // Generic save handler for different sections
    const handleSaveSection = async (section) => {
        try {
            setLoading(true);
            let endpoint = '';
            let data = {};

            switch (section) {
                case 'history':
                    endpoint = '/api/profile/history';
                    data = historyData;
                    break;
                case 'team':
                    endpoint = '/api/profile/team';
                    data = teamData;
                    break;
                case 'services':
                    endpoint = '/api/profile/services';
                    data = servicesData;
                    break;
                default:
                    throw new Error('Invalid section');
            }

            await apiRequest(endpoint, 'PUT', data);
            showNotification('success', `${section} berhasil diperbarui`);
        } catch (error) {
            showNotification('error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Kelola Profil
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Kelola informasi profil, visi misi, sejarah, tim, dan
                        layanan
                    </p>
                </div>
            </div>

            {notification.id && (
                <Notification
                    id={notification.id}
                    type={notification.type}
                    message={notification.message}
                    onClose={() =>
                        setNotification({ id: null, type: '', message: '' })
                    }
                />
            )}

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div>
                {loading &&
                activeTab !== 'hero' &&
                activeTab !== 'vision-mission' ? (
                    <div className="flex justify-center items-center py-12">
                        <FontAwesomeIcon
                            icon={faSpinner}
                            spin
                            className="text-2xl text-blue-600"
                        />
                    </div>
                ) : (
                    renderTabContent()
                )}
            </div>
        </div>
    );
}
