// src/components/admin/layanan/PackageFormModal.js
"use client";

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faTrash, 
  faSave, 
  faTimes,
  faTag,
  faMoneyBillWave,
  faPalette,
  faToggleOn,
  faToggleOff,
  faListCheck,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

import Modal from '@/components/ui/Modal/Modal';
import FormInput from '@/components/ui/FormInput/FormInput';
import TextArea from '@/components/ui/TextArea/Textarea';
import Button from '@/components/ui/button/Button';

const GRADIENT_OPTIONS = [
  { value: 'bg-gray-800', label: 'Gray Dark', preview: 'bg-gray-800' },
  { value: 'bg-gradient-to-r from-gray-400 to-gray-600', label: 'Gray Gradient', preview: 'bg-gradient-to-r from-gray-400 to-gray-600' },
  { value: 'bg-gradient-to-r from-yellow-400 to-yellow-600', label: 'Gold Gradient', preview: 'bg-gradient-to-r from-yellow-400 to-yellow-600' },
  { value: 'bg-gradient-to-r from-purple-500 to-purple-700', label: 'Purple Gradient', preview: 'bg-gradient-to-r from-purple-500 to-purple-700' },
  { value: 'bg-gradient-to-r from-blue-500 to-blue-700', label: 'Blue Gradient', preview: 'bg-gradient-to-r from-blue-500 to-blue-700' },
  { value: 'bg-gradient-to-r from-green-500 to-green-700', label: 'Green Gradient', preview: 'bg-gradient-to-r from-green-500 to-green-700' },
  { value: 'bg-gradient-to-r from-red-500 to-red-700', label: 'Red Gradient', preview: 'bg-gradient-to-r from-red-500 to-red-700' },
  { value: 'bg-gradient-to-r from-pink-500 to-rose-700', label: 'Pink Gradient', preview: 'bg-gradient-to-r from-pink-500 to-rose-700' }
];

const BADGE_COLORS = [
  { value: 'bg-red-500', label: 'Red', preview: 'bg-red-500' },
  { value: 'bg-blue-500', label: 'Blue', preview: 'bg-blue-500' },
  { value: 'bg-green-500', label: 'Green', preview: 'bg-green-500' },
  { value: 'bg-yellow-500', label: 'Yellow', preview: 'bg-yellow-500' },
  { value: 'bg-purple-500', label: 'Purple', preview: 'bg-purple-500' },
  { value: 'bg-pink-500', label: 'Pink', preview: 'bg-pink-500' },
  { value: 'bg-indigo-500', label: 'Indigo', preview: 'bg-indigo-500' },
  { value: 'bg-gray-500', label: 'Gray', preview: 'bg-gray-500' }
];

export default function PackageFormModal({ isOpen, onClose, onSave, mode, packageData }) {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    priceNumber: 0,
    bgColor: 'bg-gray-800',
    textColor: 'text-white',
    features: [''],
    badge: null,
    isActive: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBadgeForm, setShowBadgeForm] = useState(false);

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && packageData) {
        setFormData({
          title: packageData.title || '',
          price: packageData.price || '',
          priceNumber: packageData.priceNumber || 0,
          bgColor: packageData.bgColor || 'bg-gray-800',
          textColor: packageData.textColor || 'text-white',
          features: packageData.features?.map(f => typeof f === 'string' ? f : f.text) || [''],
          badge: packageData.badge || null,
          isActive: packageData.isActive !== false
        });
        setShowBadgeForm(!!packageData.badge);
      } else {
        setFormData({
          title: '',
          price: '',
          priceNumber: 0,
          bgColor: 'bg-gray-800',
          textColor: 'text-white',
          features: [''],
          badge: null,
          isActive: true
        });
        setShowBadgeForm(false);
      }
      setErrors({});
    }
  }, [isOpen, mode, packageData]);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Nama paket harus diisi';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Harga harus diisi';
    }

    if (formData.priceNumber <= 0) {
      newErrors.priceNumber = 'Harga numerik harus lebih dari 0';
    }

    const validFeatures = formData.features.filter(f => f.trim());
    if (validFeatures.length === 0) {
      newErrors.features = 'Minimal harus ada satu fitur';
    }

    if (showBadgeForm && formData.badge) {
      if (!formData.badge.text?.trim()) {
        newErrors.badgeText = 'Teks badge harus diisi';
      }
      if (!formData.badge.color?.trim()) {
        newErrors.badgeColor = 'Warna badge harus dipilih';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Process features to handle highlighted items
      const processedFeatures = formData.features
        .filter(f => f.trim())
        .map(feature => {
          // Check if feature should be highlighted (contains "diskon" keyword)
          if (feature.toLowerCase().includes('diskon')) {
            return { text: feature, highlight: true };
          }
          return feature;
        });

      const dataToSave = {
        ...formData,
        features: processedFeatures,
        badge: showBadgeForm ? formData.badge : null
      };

      await onSave(dataToSave);
    } catch (error) {
      console.error('Error saving package:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-calculate priceNumber from price string
    if (field === 'price') {
      const numericValue = value.replace(/[^\d]/g, '');
      if (numericValue) {
        setFormData(prev => ({
          ...prev,
          priceNumber: parseInt(numericValue) * 1000 // Assuming price is in K format
        }));
      }
    }
  };

  // Handle features array changes
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, features: newFeatures }));
    }
  };

  // Handle badge changes
  const handleBadgeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      badge: {
        ...prev.badge,
        [field]: value
      }
    }));
  };

  const toggleBadge = () => {
    setShowBadgeForm(!showBadgeForm);
    if (!showBadgeForm) {
      setFormData(prev => ({
        ...prev,
        badge: { text: '', color: 'bg-red-500' }
      }));
    } else {
      setFormData(prev => ({ ...prev, badge: null }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${mode === 'create' ? 'Tambah' : 'Edit'} Paket Penerbitan`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Nama Paket"
            value={formData.title}
            onChange={handleInputChange('title')}
            placeholder="contoh: BASIC, SILVER, GOLD"
            error={errors.title}
            required
            icon={faTag}
          />

          <FormInput
            label="Harga Display"
            value={formData.price}
            onChange={handleInputChange('price')}
            placeholder="contoh: 250K, 575K"
            error={errors.price}
            required
            icon={faMoneyBillWave}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Harga Numerik (Rupiah)"
            type="number"
            value={formData.priceNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, priceNumber: parseInt(e.target.value) || 0 }))}
            placeholder="contoh: 250000"
            error={errors.priceNumber}
            required
            icon={faMoneyBillWave}
          />

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <FontAwesomeIcon 
                icon={formData.isActive ? faToggleOn : faToggleOff} 
                className={`text-xl ${formData.isActive ? 'text-green-500' : 'text-gray-400'}`}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {formData.isActive ? 'Paket Aktif' : 'Paket Nonaktif'}
              </span>
            </label>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm transition-colors"
            >
              Toggle
            </button>
          </div>
        </div>

        {/* Design Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FontAwesomeIcon icon={faPalette} />
            Desain Paket
          </h3>

          {/* Background Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Warna Latar Belakang
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {GRADIENT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, bgColor: option.value }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.bgColor === option.value 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className={`w-full h-8 rounded ${option.preview} mb-2`}></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview Paket
            </label>
            <div className="max-w-sm mx-auto">
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
                {formData.badge && showBadgeForm && (
                  <div className={`absolute top-4 right-4 ${formData.badge.color} text-white px-3 py-1 rounded-full text-xs font-bold z-10`}>
                    {formData.badge.text}
                  </div>
                )}
                <div className={`${formData.bgColor} ${formData.textColor} p-4 text-center relative`}>
                  <h3 className="text-xl font-bold mb-2">{formData.title || 'Nama Paket'}</h3>
                  <div className="text-2xl font-black">{formData.price || 'Harga'}</div>
                </div>
                <div className="p-4">
                  <div className="space-y-2 text-sm">
                    {formData.features.filter(f => f.trim()).slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                    {formData.features.filter(f => f.trim()).length > 3 && (
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                        <span className="text-gray-500">+{formData.features.filter(f => f.trim()).length - 3} fitur lainnya</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Badge Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Badge</h3>
            <button
              type="button"
              onClick={toggleBadge}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                showBadgeForm 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
            >
              {showBadgeForm ? 'Hapus Badge' : 'Tambah Badge'}
            </button>
          </div>

          {showBadgeForm && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <FormInput
                label="Teks Badge"
                value={formData.badge?.text || ''}
                onChange={(e) => handleBadgeChange('text', e.target.value)}
                placeholder="contoh: POPULER, PREMIUM"
                error={errors.badgeText}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Warna Badge
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BADGE_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleBadgeChange('color', color.value)}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        formData.badge?.color === color.value 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className={`w-full h-6 rounded ${color.preview}`}></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faListCheck} />
              Fitur Paket
            </h3>
            <Button
              type="button"
              variant="outline"
              icon={faPlus}
              onClick={addFeature}
              className="text-sm"
            >
              Tambah Fitur
            </Button>
          </div>

          {errors.features && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <span>{errors.features}</span>
            </div>
          )}

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1">
                  <FormInput
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Fitur ${index + 1}`}
                  />
                </div>
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
            ))}
          </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>💡 Tips: Fitur yang mengandung kata &quot;diskon&quot; akan otomatis disorot dengan warna merah.</p>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Batal
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {mode === 'create' ? 'Menyimpan...' : 'Memperbarui...'}
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                {mode === 'create' ? 'Simpan Paket' : 'Perbarui Paket'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}