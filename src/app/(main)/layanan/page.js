"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Layanan/header";
import PackageCard from "@/components/Layanan/PackageCard";
import CTASection from "@/components/Layanan/CTASection";
import Footer from "@/components/Layanan/Footer";
import FloatingWhatsApp from "@/components/Layanan/FloatingWhatsApp";

export default function LayananPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await fetch("/api/layanan");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setPackages(data.data || []);
      } catch (e) {
        setError("Failed to load services, please try again");
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  const formatPrice = (price) => `Rp ${price.toLocaleString('id-ID')}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-20">{error}</div>;
  }

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
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                title={pkg.title}
                price={formatPrice(pkg.price)}
                features={pkg.features || []}
                bgColor={pkg.bgColor || "bg-gray-800"}
                textColor={pkg.textColor || "text-white"}
                badge={pkg.isPopular ? { text: "POPULER", color: "bg-red-500" } : null}
              />
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