"use client";

export default function CTASection({ phone }) {
  const handleClick = () => {
    if (!phone) return;
    const message = encodeURIComponent(
      "Halo, saya ingin konsultasi mengenai layanan penerbitan."
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <section className="gradient-bg text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Siap Menerbitkan Buku Anda?</h2>
        <p className="text-xl mb-8 text-yellow-100">
          Hubungi kami sekarang untuk konsultasi gratis
        </p>
        <button
          type="button"
          onClick={handleClick}
          disabled={!phone}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Hubungi via WhatsApp
        </button>
      </div>
    </section>
  );
}
