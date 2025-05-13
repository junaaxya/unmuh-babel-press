'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHouse,
    faCircleUser,
    faBook,
    faNewspaper,
    faHandshake,
    faEnvelope,
    faBars,
    faXmark,
    faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import DarkModeToggle from '../ui/DarkModeToggle/DarkModeToggle';
import SearchBar from '../searchbar/SearchBar';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-blue-600 text-white shadow">
            <div className="flex items-center justify-between px-4 py-3">
                {/* Logo + Title */}
                <div className="flex items-center space-x-4">
                    <Image
                        src="/unmuhpress.png"
                        alt="Logo"
                        width={50}
                        height={50}
                    />
                    <div className="text-xs leading-tight">
                        <p className="font-bold text-[10px] md:text-lg">
                            BADAN PENERBIT DAN PUBLIKASI
                        </p>
                        <p className="text-[7px] md:text-sm md:-my-1.5">
                            Universitas Muhammadiyah Bangka Belitung
                        </p>
                    </div>
                </div>

                {/* Search + DarkMode + Toggle */}
                <div className="flex items-center gap-3">
                    <div className="hidden md:block">
                        <SearchBar />
                    </div>
                    <DarkModeToggle />
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-white text-lg"
                    >
                        <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
                    </button>
                </div>
            </div>

            {/* Menu Items */}
            <div
                className={`bg-blue-700 shadow-sm/50 md:flex md:items-center md:justify-center transition-all duration-300 ${
                    menuOpen ? 'block' : 'hidden'
                }`}
            >
                <ul className="flex flex-col md:flex-row md:space-x-6 text-sm p-4 md:p-2">
                    <li>
                        <Link href="/" className="flex items-center py-2">
                            <FontAwesomeIcon icon={faHouse} className="mr-2" />
                            Beranda
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="flex items-center py-2">
                            <FontAwesomeIcon
                                icon={faCircleUser}
                                className="mr-2"
                            />
                            Profil
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="flex items-center py-2">
                            <FontAwesomeIcon icon={faBook} className="mr-2" />
                            Katalog
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="flex items-center py-2">
                            <FontAwesomeIcon
                                icon={faNewspaper}
                                className="mr-2"
                            />
                            Berita & Event
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="flex items-center py-2">
                            <FontAwesomeIcon
                                icon={faHandshake}
                                className="mr-2"
                            />
                            Layanan
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="flex items-center py-2">
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                className="mr-2"
                            />
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
