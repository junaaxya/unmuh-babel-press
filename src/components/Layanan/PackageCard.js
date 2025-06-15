export default function PackageCard({ title, price, features = [], bgColor, textColor = "text-white", badge = null, isPopular = false }) {
  const autoTextColor = textColor || (bgColor?.includes("yellow") ? "text-white" : "go");
  const handleSelectPackage = () => {
    // Scroll to footer or handle package selection
    const footer = document.querySelector("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`card-hover bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden relative`}>
      {badge && <div className={`absolute top-4 right-4 ${badge.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>{badge.text}</div>}

      <div className={`${bgColor} ${textColor} p-6 text-center`}>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <div className="text-3xl font-black text-white">{price}</div>
      </div>

      <div className="p-6">
        <ul className="space-y-3 text-sm">
          {features.map((feature, index) => (
            <li key={index} className={`feature-item ${feature.highlight ? "text-red-600 font-semibold" : ""}`}>
              {feature.text || feature}
            </li>
          ))}
        </ul>

        <button onClick={handleSelectPackage} className={`w-full mt-6 ${bgColor} ${textColor} py-3 rounded-lg hover:opacity-90 transition-all font-semibold`}>
          Pilih Paket
        </button>
      </div>
    </div>
  );
}