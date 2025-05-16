'use client';


import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faYoutube,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-gray-300 py-12 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Kolom 1: Logo & Deskripsi */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image src="/unmuhpress.png" alt="Logo" width={60} height={60} />
            <h2 className="text-white font-bold text-lg leading-tight">
              BADAN PENERBIT <br /> DAN PUBLIKASI
            </h2>
          </div>
          <p className="text-sm mb-4">
            Badan Penerbit dan Publikasi Universitas Muhammadiyah Bangka Belitung
          </p>
          <div className="flex gap-4 text-lg">
            <FontAwesomeIcon icon={faFacebookF} className="hover:text-white cursor-pointer" />
            <FontAwesomeIcon icon={faTwitter} className="hover:text-white cursor-pointer" />
            <FontAwesomeIcon icon={faInstagram} className="hover:text-white cursor-pointer" />
            <FontAwesomeIcon icon={faYoutube} className="hover:text-white cursor-pointer" />
            <FontAwesomeIcon icon={faLinkedinIn} className="hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Kolom 2: Tautan Cepat */}
        <div>
          <h3 className="text-white font-semibold mb-4">Tautan Cepat</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Beranda</a></li>
            <li><a href="#" className="hover:underline">Profil</a></li>
            <li><a href="#" className="hover:underline">Katalog</a></li>
            <li><a href="#" className="hover:underline">Berita & Event</a></li>
            <li><a href="#" className="hover:underline">Layanan</a></li>
            <li><a href="#" className="hover:underline">Kontak</a></li>
          </ul>
        </div>

        {/* Kolom 3: Layanan */}
        <div>
          <h3 className="text-white font-semibold mb-4">Layanan Unmuh Press</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Paket Penerbitan</a></li>
          </ul>
        </div>

        {/* Kolom 4: Kontak */}
        <div>
          <h3 className="text-white font-semibold mb-4">Kontak Kami</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-400 mt-1" />
              <span>Gedung Rektorat Lt.3, Universitas Muhammadiyah Bangka Belitung, Jl. Pendidikan No.1, Pangkal Pinang</span>
            </li>
            <li className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} className="text-blue-400" />
              (021) 12345678
            </li>
            <li className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="text-blue-400" />
              haki@univ.edu
            </li>
            <li className="flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="text-blue-400" />
              Senin–Jumat: 08.00–16.00 WIB
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2023 Portal HAKI Universitas Muhammadiyah Bangka Belitung. Seluruh hak cipta dilindungi.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:underline">Kebijakan Privasi</a>
          <a href="#" className="hover:underline">Syarat & Ketentuan</a>
          <a href="#" className="hover:underline">Peta Situs</a>
        </div>
      </div>
    </footer>
  );
}
