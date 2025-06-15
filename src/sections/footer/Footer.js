import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Column 1 - About */}
                    <div className="mb-6 lg:mb-0">
                        <div className="flex items-center mb-4">
                            <Image
                                src="/unmuhpress.png"
                                alt="Unmuh Press Logo"
                                width={90}
                                height={90}
                                className="mr-2"
                            />
                            <div>
                                <h2 className="text-white font-bold text-lg leading-tight">
                                    BADAN PENERBIT
                                    <br />
                                    DAN PUBLIKASI
                                </h2>
                            </div>
                        </div>
                        <p className="text-sm mb-4">
                            Badan Penerbit dan Publikasi Universitas
                            Muhammadiyah Bangka Belitung
                        </p>
                        <div className="flex space-x-3">
                            <Link
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                            >
                                <div className="bg-gray-700 hover:bg-blue-600 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300">
                                    <FontAwesomeIcon
                                        icon={faFacebookF}
                                        className="w-4 h-4"
                                    />
                                </div>
                            </Link>
                            <Link
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Twitter"
                            >
                                <div className="bg-gray-700 hover:bg-blue-400 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300">
                                    <FontAwesomeIcon
                                        icon={faTwitter}
                                        className="w-4 h-4"
                                    />
                                </div>
                            </Link>
                            <Link
                                href="https://instagram.com/unmuhbabelpress"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                            >
                                <div className="bg-gray-700 hover:bg-pink-600 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300">
                                    <FontAwesomeIcon
                                        icon={faInstagram}
                                        className="w-4 h-4"
                                    />
                                </div>
                            </Link>
                            <Link
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="YouTube"
                            >
                                <div className="bg-gray-700 hover:bg-red-600 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300">
                                    <FontAwesomeIcon
                                        icon={faYoutube}
                                        className="w-4 h-4"
                                    />
                                </div>
                            </Link>
                            <Link
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                            >
                                <div className="bg-gray-700 hover:bg-blue-700 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300">
                                    <FontAwesomeIcon
                                        icon={faLinkedinIn}
                                        className="w-4 h-4"
                                    />
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Column 2 - Quick Links */}
                    <div className="mb-6 lg:mb-0">
                        <h3 className="text-white font-bold text-lg mb-4">
                            Tautan Cepat
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/#"
                                    className="hover:text-blue-400 transition-colors duration-300 flex items-center"
                                >
                                    <span className="text-blue-500 mr-2">
                                        ›
                                    </span>
                                    <span>Beranda</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/profil"
                                    className="hover:text-blue-400 transition-colors duration-300 flex items-center"
                                >
                                    <span className="text-blue-500 mr-2">
                                        ›
                                    </span>
                                    <span>Profil</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/catalog"
                                    className="hover:text-blue-400 transition-colors duration-300 flex items-center"
                                >
                                    <span className="text-blue-500 mr-2">
                                        ›
                                    </span>
                                    <span>Katalog</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/berita-event"
                                    className="hover:text-blue-400 transition-colors duration-300 flex items-center"
                                >
                                    <span className="text-blue-500 mr-2">
                                        ›
                                    </span>
                                    <span>Berita & Event</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/layanan"
                                    className="hover:text-blue-400 transition-colors duration-300 flex items-center"
                                >
                                    <span className="text-blue-500 mr-2">
                                        ›
                                    </span>
                                    <span>Layanan</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/kontak"
                                    className="hover:text-blue-400 transition-colors duration-300 flex items-center"
                                >
                                    <span className="text-blue-500 mr-2">
                                        ›
                                    </span>
                                    <span>Kontak</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3 - Services */}
                    <div className="mb-6 lg:mb-0">
                        <h3 className="text-white font-bold text-lg mb-4">
                            Layanan Unmuh Press
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/paket-penerbitan"
                                    className="hover:text-blue-400 transition-colors duration-300"
                                >
                                    Paket Penerbitan
                                </Link>
                            </li>
                            {/* Add other services here as needed */}
                        </ul>
                    </div>

                    {/* Column 4 - Contact */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">
                            Kontak Kami
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex">
                                <FontAwesomeIcon
                                    icon={faMapMarkerAlt}
                                    className="text-blue-400 mr-3 mt-1 w-5"
                                />
                                <span>
                                    Gedung Rektorat Lt.3, Universitas
                                    Muhammadiyah Bangka Belitung, Jl. KH Ahmad
                                    Dahlan, Keramat, Rangkui, Pangkal Pinang,
                                    Bangka Belitung
                                </span>
                            </li>
                            <li className="flex items-center">
                                <FontAwesomeIcon
                                    icon={faPhone}
                                    className="text-blue-400 mr-3 w-5"
                                />
                                <span>(+62) 821-7122-2017</span>
                            </li>
                            <li className="flex items-center">
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className="text-blue-400 mr-3 w-5"
                                />
                                <Link
                                    href="mailto:haki@univ.edu"
                                    className="hover:text-blue-400 transition-colors duration-300"
                                >
                                    ubp@unmuhbabel.ac.id
                                </Link>
                            </li>
                            <li className="flex items-center">
                                <FontAwesomeIcon
                                    icon={faClock}
                                    className="text-blue-400 mr-3 w-5"
                                />
                                <span>Senin-Jumat: 08.00-16.00 WIB</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer Bottom - Copyright */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm mb-4 md:mb-0">
                            © {new Date().getFullYear()} Unmuh Babel Press.
                            Seluruh hak cipta dilindungi.
                        </p>
                        <div className="flex space-x-4 text-sm">
                            <Link
                                href="/"
                                className="hover:text-blue-400 transition-colors duration-300"
                            >
                                Kebijakan Privasi
                            </Link>
                            <Link
                                href="/"
                                className="hover:text-blue-400 transition-colors duration-300"
                            >
                                Syarat & Ketentuan
                            </Link>
                            <Link
                                href="/"
                                className="hover:text-blue-400 transition-colors duration-300"
                            >
                                Beranda
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
