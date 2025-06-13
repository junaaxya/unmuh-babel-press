export default function SectionHeading({ title, subtitle }) {
    return (
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900">{title}</h2>
        <p className="text-gray-600 -mt-1 text-lg font-semibold">{subtitle}</p>
      </div>
    );
  }
  