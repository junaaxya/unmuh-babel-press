import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faSave, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';
import FormInput from '@/components/ui/FormInput/FormInput';
import TextArea from '@/components/ui/TextArea/Textarea';

export default function NewsEventForm({ type, initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    image: '',
    date: '',
    category: type === 'berita' ? 'Berita' : 'Event',
    author: '',
    slug: '',
    // Event specific fields
    time: '',
    location: '',
    status: 'Upcoming',
    organizer: ''
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setImagePreview(initialData.image);
    } else {
      // Reset form for new item
      setFormData({
        title: '',
        excerpt: '',
        image: '',
        date: '',
        category: type === 'berita' ? 'Berita' : 'Event',
        author: '',
        slug: '',
        time: '',
        location: '',
        status: 'Upcoming',
        organizer: ''
      });
      setImagePreview('');
    }
  }, [initialData, type]);

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto-generate slug from title
      ...(name === 'title' && { slug: generateSlug(value) })
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload this file to a server
      // For now, we'll create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          image: `/images/${type === 'berita' ? 'news' : 'events'}/${file.name}`
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Judul harus diisi';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Ringkasan harus diisi';
    }

    if (!formData.date) {
      newErrors.date = 'Tanggal harus diisi';
    }

    if (!formData.image) {
      newErrors.image = 'Gambar harus diisi';
    }

    if (type === 'berita') {
      if (!formData.author.trim()) {
        newErrors.author = 'Penulis harus diisi';
      }
    } else {
      if (!formData.time.trim()) {
        newErrors.time = 'Waktu harus diisi';
      }
      if (!formData.location.trim()) {
        newErrors.location = 'Lokasi harus diisi';
      }
      if (!formData.organizer.trim()) {
        newErrors.organizer = 'Penyelenggara harus diisi';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const categoryOptions = type === 'berita' 
    ? ['Berita', 'Pengumuman', 'Artikel', 'Press Release']
    : ['Event', 'Workshop', 'Seminar', 'Konferensi', 'Pelatihan'];

  const statusOptions = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Gambar *
        </label>
        
        <div className="flex items-start space-x-4">
          {/* Image Preview */}
          <div className="flex-shrink-0">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-24 w-24 rounded-lg object-cover border border-gray-300 dark:border-gray-600"
              />
            ) : (
              <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                <FontAwesomeIcon icon={faImage} className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex-1">
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
              <FontAwesomeIcon icon={faUpload} className="w-4 h-4 mr-2" />
              Pilih Gambar
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              PNG, JPG, JPEG hingga 5MB
            </p>
          </div>
        </div>
        
        {errors.image && (
          <p className="text-red-600 dark:text-red-400 text-sm">{errors.image}</p>
        )}
      </div>

      {/* Title */}
      <FormInput
        label="Judul"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
        placeholder={`Masukkan judul ${type === 'berita' ? 'berita' : 'event'}`}
      />

      {/* Excerpt */}
      <TextArea
        label="Ringkasan"
        name="excerpt"
        value={formData.excerpt}
        onChange={handleChange}
        error={errors.excerpt}
        required
        rows={3}
        placeholder="Masukkan ringkasan singkat"
      />

      {/* Date and Category Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Tanggal"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Kategori *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {categoryOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Conditional Fields */}
      {type === 'berita' ? (
        // News specific fields
        <FormInput
          label="Penulis"
          name="author"
          value={formData.author}
          onChange={handleChange}
          error={errors.author}
          required
          placeholder="Masukkan nama penulis"
        />
      ) : (
        // Event specific fields
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Waktu"
              name="time"
              value={formData.time}
              onChange={handleChange}
              error={errors.time}
              required
              placeholder="08:00 - 10:30 WIB"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <FormInput
            label="Lokasi"
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            required
            placeholder="Masukkan lokasi event"
          />

          <FormInput
            label="Penyelenggara"
            name="organizer"
            value={formData.organizer}
            onChange={handleChange}
            error={errors.organizer}
            required
            placeholder="Masukkan nama penyelenggara"
          />
        </>
      )}

      {/* Slug */}
      <FormInput
        label="Slug"
        name="slug"
        value={formData.slug}
        onChange={handleChange}
        placeholder="url-friendly-slug"
        helpText="URL yang akan digunakan untuk halaman ini"
      />

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faTimes} className="w-4 h-4 mr-2" />
          Batal
        </button>
        
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faSave} className="w-4 h-4 mr-2" />
          {initialData ? 'Perbarui' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}