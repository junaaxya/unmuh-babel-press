// src/components/admin/layanan/PackageCard.js
"use client";

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faTrash, 
  faEye, 
  faEllipsisVertical,
  faTags,
  faMoneyBillWave,
  faListCheck,
  faToggleOn,
  faToggleOff,
  faCrown,
  faStar
} from '@fortawesome/free-solid-svg-icons';

export default function PackageCard({ package: pkg, onEdit, onView, onDelete, onToggleStatus }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStatus = async () => {
    setIsLoading(true);
    try {
      await onToggleStatus?.(pkg);
    } finally {
      setIsLoading(false);
    }
  };

  const getBadgeIcon = (badgeText) => {
    switch (badgeText?.toLowerCase()) {
      case 'populer':
        return faStar;
      case 'premium':
        return faCrown;
      default:
        return faTags;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header with Badge and Actions */}
      <div className="relative">
        {/* Package Preview Header */}
        <div className={`${pkg.bgColor} ${pkg.textColor || 'text-white'} p-4 text-center relative`}>
          {/* Badge */}
          {pkg.badge && (
            <div className={`absolute top-2 right-2 ${pkg.badge.color} text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
              <FontAwesomeIcon icon={getBadgeIcon(pkg.badge.text)} className="text-xs" />
              {pkg.badge.text}
            </div>
          )}
          
          {/* Status Indicator */}
          <div className="absolute top-2 left-2">
            <div className={`w-3 h-3 rounded-full ${pkg.isActive ? 'bg-green-400' : 'bg-red-400'} shadow-lg`}></div>
          </div>

          <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
          <div className="text-2xl font-black">{pkg.price}</div>
        </div>

        {/* Dropdown Menu */}
        <div className="absolute top-2 right-2">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <FontAwesomeIcon icon={faEllipsisVertical} className="text-white text-sm" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-20">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onView();
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faEye} className="text-blue-500" />
                    Lihat Detail
                  </button>
                  
                  <button
                    onClick={() => {
                      onEdit();
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faEdit} className="text-green-500" />
                    Edit Paket
                  </button>
                  
                  <button
                    onClick={handleToggleStatus}
                    disabled={isLoading}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    <FontAwesomeIcon 
                      icon={pkg.isActive ? faToggleOff : faToggleOn} 
                      className={pkg.isActive ? "text-yellow-500" : "text-green-500"} 
                    />
                    {isLoading ? 'Mengubah...' : (pkg.isActive ? 'Nonaktifkan' : 'Aktifkan')}
                  </button>
                  
                  <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                  
                  <button
                    onClick={() => {
                      onDelete();
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Hapus Paket
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-blue-600 text-sm" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Harga</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {pkg.priceNumber ? `Rp ${(pkg.priceNumber / 1000).toFixed(0)}K` : pkg.price}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
              <FontAwesomeIcon icon={faListCheck} className="text-green-600 text-sm" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Fitur</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {pkg.features?.length || 0} items
              </p>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fitur Utama:
          </p>
          <div className="space-y-1">
            {pkg.features?.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {typeof feature === 'string' ? feature : feature.text}
                </span>
              </div>
            ))}
            {pkg.features?.length > 3 && (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full flex-shrink-0"></div>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  +{pkg.features.length - 3} fitur lainnya
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Status and Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <FontAwesomeIcon 
              icon={pkg.isActive ? faToggleOn : faToggleOff} 
              className={pkg.isActive ? "text-green-500" : "text-red-500"} 
            />
            <span>{pkg.isActive ? 'Aktif' : 'Nonaktif'}</span>
          </div>
          
          <div className="text-right">
            <p>Updated: {new Date(pkg.updatedAt).toLocaleDateString('id-ID', { 
              day: '2-digit', 
              month: 'short' 
            })}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium transition-colors"
          >
            <FontAwesomeIcon icon={faEye} className="text-xs" />
            Lihat
          </button>
          
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium transition-colors"
          >
            <FontAwesomeIcon icon={faEdit} className="text-xs" />
            Edit
          </button>
          
          <button
            onClick={onDelete}
            className="px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium transition-colors"
          >
            <FontAwesomeIcon icon={faTrash} className="text-xs" />
          </button>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}