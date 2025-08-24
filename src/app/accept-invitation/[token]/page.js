"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope, 
  faUser, 
  faLock, 
  faCheckCircle, 
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

export default function AcceptInvitationPage({ params }) {
  const router = useRouter();
  const { token } = use(params);
  const [form, setForm] = useState({ name: "", password: "" });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/auth/accept-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...form }),
      });
      
      if (res.ok) {
        router.push("/admin/login");
      } else {
        const data = await res.json();
        setError(data.error || "Gagal menerima undangan");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Card */}
        <div className="bg-white rounded-t-2xl shadow-xl p-8 text-center border-b border-gray-100">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon 
              icon={faEnvelope} 
              className="w-8 h-8 text-blue-600" 
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Aktivasi Akun
          </h1>
          <p className="text-gray-600 text-sm">
            Lengkapi informasi berikut untuk mengaktifkan akun Anda
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-b-2xl shadow-xl p-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
              <FontAwesomeIcon 
                icon={faExclamationTriangle} 
                className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" 
              />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon 
                    icon={faUser} 
                    className="w-5 h-5 text-gray-400" 
                  />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Masukkan nama lengkap Anda"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon 
                    icon={faLock} 
                    className="w-5 h-5 text-gray-400" 
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Buat kata sandi yang aman"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon 
                    icon={showPassword ? faEyeSlash : faEye} 
                    className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" 
                  />
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Minimal 8 karakter dengan kombinasi huruf dan angka
              </p>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon 
                    icon={faSpinner} 
                    className="w-5 h-5 mr-2 animate-spin" 
                  />
                  Mengaktifkan Akun...
                </>
              ) : (
                <>
                  <FontAwesomeIcon 
                    icon={faCheckCircle} 
                    className="w-5 h-5 mr-2" 
                  />
                  Aktivasi Akun
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Dengan mengaktifkan akun, Anda menyetujui{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                syarat dan ketentuan
              </a>{" "}
              yang berlaku.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}