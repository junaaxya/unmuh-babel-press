
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFacebookF,
    faTwitter,
    faInstagram,
    faYoutube,
    faLinkedinIn,
    faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import {
    faMapMarkerAlt,
    faPhone,
    faEnvelope,
    faClock,
    faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';

const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const socialIconMap = {
    'fa-facebook': faFacebookF,
    'fa-twitter': faTwitter,
    'fa-instagram': faInstagram,
    'fa-youtube': faYoutube,
    'fa-linkedin': faLinkedinIn,
    'fa-whatsapp': faWhatsapp,
};

const socialHoverMap = {
    Facebook: 'hover:bg-blue-600',
    Twitter: 'hover:bg-blue-400',
    Instagram: 'hover:bg-pink-600',
    YouTube: 'hover:bg-red-600',
    LinkedIn: 'hover:bg-blue-700',
    WhatsApp: 'hover:bg-green-600',
};

export default async function Footer() {
    let contact = null;
    try {
        const res = await fetch(`${base}/api/profile/contact`, { cache: 'no-store' });
        const json = res.ok ? await res.json() : { data: null };
        contact = json.data;
    } catch (e) {
        console.error(e);
    }

    const socialLinks = (contact?.socialLinks || []).map((s) => ({
        ...s,
        icon: s.icon || 'fa-circle-info',
    }));

    const addressParts = [
        contact?.addressStreet,
        contact?.addressCity,
        contact?.addressProvince,
        contact?.addressPostal,
    ].filter(Boolean);
    const address = addressParts.join(', ');

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
                            {socialLinks.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={item.platform}
                                >
                                    <div
                                        className={`bg-gray-700 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${socialHoverMap[item.platform] || 'hover:bg-gray-600'}`}
                                    >
                                        <FontAwesomeIcon
                                            icon={socialIconMap[item.icon] || faCircleInfo}
                                            className="w-4 h-4"
                                        />
                                    </div>
                                </Link>
                            ))}
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
                                    href="/layanan"
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
                            {address && (
                                <li className="flex">
                                    <FontAwesomeIcon
                                        icon={faMapMarkerAlt}
                                        className="text-blue-400 mr-3 mt-1 w-5"
                                    />
                                    <span>{address}</span>
                                </li>
                            )}
                            {contact?.phoneNumber && (
                                <li className="flex items-center">
                                    <FontAwesomeIcon
                                        icon={faPhone}
                                        className="text-blue-400 mr-3 w-5"
                                    />
                                    <span>{contact.phoneNumber}</span>
                                </li>
                            )}
                            {contact?.emailGeneral && (
                                <li className="flex items-center">
                                    <FontAwesomeIcon
                                        icon={faEnvelope}
                                        className="text-blue-400 mr-3 w-5"
                                    />
                                    <Link
                                        href={`mailto:${contact.emailGeneral}`}
                                        className="hover:text-blue-400 transition-colors duration-300"
                                    >
                                        {contact.emailGeneral}
                                    </Link>
                                </li>
                            )}
                            {(contact?.hoursWeekdays || contact?.hoursWeekend || contact?.hoursClosed) && (
                                <li className="flex items-center">
                                    <FontAwesomeIcon
                                        icon={faClock}
                                        className="text-blue-400 mr-3 w-5"
                                    />
                                    <span>
                                        {contact?.hoursWeekdays && (
                                            <>
                                                {contact.hoursWeekdays}
                                                <br />
                                            </>
                                        )}
                                        {contact?.hoursWeekend && (
                                            <>
                                                {contact.hoursWeekend}
                                                <br />
                                            </>
                                        )}
                                        {contact?.hoursClosed}
                                    </span>
                                </li>
                            )}
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
