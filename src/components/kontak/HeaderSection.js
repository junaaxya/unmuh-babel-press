// src/components/Kontak/HeaderSection.js
export default function HeaderSection() {
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.0204295911553!2d106.09073587473985!3d-2.1458621978350356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e22c6c8aa06c211%3A0x5ea711e1b7859e8c!2sUniversitas%20Muhammadiyah%20Bangka%20Belitung!5e0!3m2!1sid!2sid!4v1749827155756!5m2!1sid!2sid"
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