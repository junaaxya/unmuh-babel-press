// components/DarkModeToggle.js
'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

export default function DarkModeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Hindari render di server

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className={`
                relative
                w-16 h-8 md:w-20 md:h-10   /* Ukuran default untuk mobile, dan lebih besar di layar md ke atas */
                rounded-full flex items-center justify-center cursor-pointer
                transition-colors duration-300 ease-in-out overflow-hidden
                ${theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-400'}
            `}
            aria-label={
                theme === 'dark'
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
            }
        >
            {/* Div untuk ikon Matahari */}
            <div
                className={`
                    absolute left-1.5 md:left-2 /* Sesuaikan posisi horizontal untuk mobile dan desktop */
                    transition-all duration-300 ease-in-out
                    ${
                        theme === 'dark'
                            ? 'translate-x-full opacity-0'
                            : 'translate-x-0 opacity-100'
                    }
                `}
            >
                <FontAwesomeIcon
                    icon={faSun}
                    className="text-yellow-500 text-xl md:text-2xl" /* Ukuran ikon untuk mobile dan desktop */
                />
            </div>

            {/* Div untuk ikon Bulan */}
            <div
                className={`
                    absolute right-1.5 md:right-2 /* Sesuaikan posisi horizontal untuk mobile dan desktop */
                    transition-all duration-300 ease-in-out
                    ${
                        theme === 'dark'
                            ? 'translate-x-0 opacity-100'
                            : '-translate-x-full opacity-0'
                    }
                `}
            >
                <FontAwesomeIcon
                    icon={faMoon}
                    className="text-gray-200 text-xl md:text-2xl" /* Ukuran ikon untuk mobile dan desktop */
                />
            </div>
        </button>
    );
}
