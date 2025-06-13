// src/components/Kontak/ContactForm.js
"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    subjek: "",
    pesan: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama lengkap wajib diisi";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Alamat email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.pesan.trim()) {
      newErrors.pesan = "Pesan wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulasi pengiriman form
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Reset form after successful submission
      setFormData({
        nama: "",
        email: "",
        subjek: "",
        pesan: "",
      });

      alert("Pesan berhasil dikirim! Kami akan segera menghubungi Anda.");
    } catch (error) {
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nama Lengkap */}
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
            Nama Lengkap *
          </label>
          <input
            type="text"
            id="nama"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.nama ? "border-red-500" : "border-gray-300"}`}
            placeholder="Masukkan nama lengkap Anda"
          />
          {errors.nama && <p className="mt-1 text-sm text-red-600">{errors.nama}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Alamat Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.email ? "border-red-500" : "border-gray-300"}`}
            placeholder="nama@email.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Subjek */}
        <div>
          <label htmlFor="subjek" className="block text-sm font-medium text-gray-700 mb-2">
            Subjek
          </label>
          <input
            type="text"
            id="subjek"
            name="subjek"
            value={formData.subjek}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Subjek pesan (opsional)"
          />
        </div>

        {/* Pesan */}
        <div>
          <label htmlFor="pesan" className="block text-sm font-medium text-gray-700 mb-2">
            Pesan *
          </label>
          <textarea
            id="pesan"
            name="pesan"
            rows={5}
            value={formData.pesan}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical ${errors.pesan ? "border-red-500" : "border-gray-300"}`}
            placeholder="Tulis pesan Anda di sini..."
          />
          {errors.pesan && <p className="mt-1 text-sm text-red-600">{errors.pesan}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Mengirim...
            </span>
          ) : (
            "Kirim Pesan"
          )}
        </button>
      </form>
    </div>
  );
}
