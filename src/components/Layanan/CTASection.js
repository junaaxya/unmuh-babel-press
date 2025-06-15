export default function CTASection() {
  return (
    <section className="gradient-bg text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Siap Menerbitkan Buku Anda?</h2>
        <p className="text-xl mb-8 text-yellow-100">Hubungi kami sekarang untuk konsultasi gratis</p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <div className="cta bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Kontak WhatsApp</h3>
            <p className="text-2xl font-bold gold-text mb-2">0821-7122-2017</p>
            <p className="text-sm text-yellow-200">A.N Zikri Wahyuzi</p>
          </div>

          <div className="cta bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Website</h3>
            <p className="text-lg font-bold gold-text mb-2">lppmpp.ac.id</p>
            <p className="text-sm text-yellow-200">@lppmpp_unmuhbabel</p>
          </div>
        </div>
      </div>
    </section>
  );
}