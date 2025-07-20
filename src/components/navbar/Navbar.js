
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCircleUser, faBook, faNewspaper, faHandshake, faEnvelope, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import DarkModeToggle from "../ui/DarkModeToggle/DarkModeToggle";
import SearchBar from "../searchbar/SearchBar";

export default function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const [logoUrl, setLogoUrl] = useState('/uploads/logo.png');
    // Ambil logo dari API
    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const res = await fetch('/api/beranda', {
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Gagal memuat logo');
                const data = await res.json();
                if (data.logo) setLogoUrl(`${data.logo}?t=${Date.now()}`);
            } catch (err) {
                console.error('Gagal mengambil logo:', err);
            }
        };
        fetchLogo();
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <nav className="bg-cyan-50 text-white shadow">
            <div className="flex items-center justify-between px-4 py-3">
                {/* Logo + Title */}
                <Link href="/" className="flex items-center space-x-4">
                    <Image
                        src={logoUrl}
                        alt="Logo"
                        width={90}
                        height={90}
                        className="w-15 md:w-25 h-auto"
                        style={{ objectFit: 'contain' }}
                    />
                    <div className="text-xs leading-tight">
                        <p className="font-bold text-[10px] md:text-lg text-blue-700">
                            BADAN PENERBIT DAN PUBLIKASI
                        </p>
                        <p className="text-[6px] md:text-sm md:-my-1.5 text-gray-700">
                            Universitas Muhammadiyah Bangka Belitung
                        </p>
                    </div>
                </Link>
            </div>
            {/* Menu Items */}
            <div
                ref={menuRef}
                className={`bg-blue-700 shadow-sm/50 md:flex md:items-center md:justify-center transition-all duration-300 ${
                    menuOpen ? 'block' : 'hidden'
                }`}
            >
                <ul className="flex flex-col md:flex-row md:space-x-6 text-sm p-4 md:p-2">
                    <li>
                        <Link
                            href="/"
                            className="flex items-center py-2"
                            onClick={() => setMenuOpen(false)}
                        >
                            <FontAwesomeIcon icon={faHouse} className="mr-2" />{' '}
                            Beranda
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/profil"
                            className="flex items-center py-2"
                            onClick={() => setMenuOpen(false)}
                        >
                            <FontAwesomeIcon
                                icon={faCircleUser}
                                className="mr-2"
                            />{' '}
                            Profil
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/catalog"
                            className="flex items-center py-2"
                            onClick={() => setMenuOpen(false)}
                        >
                            <FontAwesomeIcon icon={faBook} className="mr-2" />{' '}
                            Katalog
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/berita-event"
                            className="flex items-center py-2"
                            onClick={() => setMenuOpen(false)}
                        >
                            <FontAwesomeIcon
                                icon={faNewspaper}
                                className="mr-2 w-4 text-center"
                                fixedWidth
                            />{' '}
                            Berita & Event
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/layanan"
                            className="flex items-center py-2"
                            onClick={() => setMenuOpen(false)}
                        >
                            <FontAwesomeIcon
                                icon={faHandshake}
                                className="mr-2 w-4 text-center"
                            />
                           Paket Penerbitan

                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/kontak"
                            className="flex items-center py-2"
                            onClick={() => setMenuOpen(false)}
                        >
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                className="mr-2"
                            />{' '}
                            Kontak
                        </Link>
                    </li>
                </ul>


        {/* Search Mobile */}
        <div className="block md:hidden px-4 pb-4">
          <SearchBar />
        </div>
      </div>
    </nav>
  );
}
