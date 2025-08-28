// src/components/Kontak/HeaderSection.js
export default function HeaderSection({ address }) {
  const mapQuery = encodeURIComponent(address || 'Universitas Muhammadiyah Bangka Belitung');
  const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Kontak Kami</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">Hubungi kami untuk pertanyaan, konsultasi, atau kerjasama. Tim kami siap membantu Anda dengan layanan terbaik.</p>
        </div>

        {/* Google Maps Embed */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <iframe
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Kantor Kami"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}