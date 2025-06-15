"use client";
import Header from "@/components/Layanan/header";
import PackageCard from "@/components/Layanan/PackageCard";
import CTASection from "@/components/Layanan/CTASection";
import Footer from "@/components/Layanan/Footer";
import FloatingWhatsApp from "@/components/Layanan/FloatingWhatsApp";

export default function LayananPage() {
  const packages = [
    {
      title: "BASIC",
      price: "250K",
      bgColor: "bg-gray-800",
      features: ["ISBN", "Desain Cover", "Template Buku", "Surat LOA", "Surat Bukti Terbit", "Sertifikat Penulis", "Indeks Google Scholar"],
    },
    {
      title: "SILVER",
      price: "575K",
      bgColor: "bg-gradient-to-r from-gray-400 to-gray-600",
      features: [
        "ISBN",
        "Desain Cover",
        "Template Buku",
        "Surat LOA",
        "Surat Bukti Terbit",
        "Sertifikat Penulis",
        "Indeks Google Scholar",
        "Buku Ukuran A5 (150 halaman)",
        "Desain Layout",
        "Full E-Book",
        "1 Buku Arsip Penulis",
        "1 Buku Arsip Penerbit",
        "2 Buku Arsip Perpusnas",
      ],
    },
    {
      title: "GOLD",
      price: "850K",
      bgColor: "bg-gradient-to-r from-yellow-400 to-yellow-600",
      badge: { text: "POPULER", color: "bg-red-500" },
      features: [
        "ISBN",
        "Desain Cover",
        "Template Buku",
        "Surat LOA",
        "Surat Bukti Terbit",
        "Sertifikat Penulis",
        "Indeks Google Scholar",
        "Buku Ukuran A5 (200 halaman)",
        "Desain Layout",
        "Full E-Book",
        "2 Buku Arsip Penulis",
        "1 Buku Arsip Penerbit",
        "2 Buku Arsip Perpusnas",
        "Wrapping Buku",
        { text: "Diskon HKI 25 Ribu", highlight: true },
      ],
    },
    {
      title: "PLATINUM",
      price: "1150K",
      bgColor: "bg-gradient-to-r from-purple-500 to-purple-700",
      badge: { text: "PREMIUM", color: "bg-purple-500" },
      features: [
        "ISBN",
        "Desain Cover",
        "Template Buku",
        "Surat LOA",
        "Surat Bukti Terbit",
        "Sertifikat Penulis",
        "Indeks Google Scholar",
        "Buku Ukuran A5 (250 halaman)",
        "Desain Layout",
        "Full E-Book",
        "3 Buku Arsip Penulis",
        "1 Buku Arsip Penerbit",
        "2 Buku Arsip Perpusnas",
        "Wrapping Buku",
        { text: "Diskon HKI 50 Ribu", highlight: true },
      ],
    },
  ];

  return (
    <>
      <Header />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Pilihan Paket Penerbitan</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Kami menyediakan berbagai paket penerbitan yang disesuaikan dengan kebutuhan dan budget Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg, i) => (
              <PackageCard key={i} {...pkg} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      {/* <Footer /> */}
      <FloatingWhatsApp />
    </>
  );
}
