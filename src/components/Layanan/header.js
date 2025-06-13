export default function Header() {
  return (
    <header className="gradient-bg text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          {/* Logo Section */}
          {/* <div className="flex justify-center items-center mb-8">
            <div className="bg-white rounded-full p-4 shadow-lg mr-4">
              <div className="w-12 h-12 bg-red-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">U</span>
              </div>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold">UNMUH BABEL PRESS</h3>
              <p className="text-yellow-200 text-sm">Universitas Muhammadiyah Bangka Belitung</p>
            </div>
          </div> */}

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
            <span className="gold-text">PAKET</span>
            <br />
            <span className="text-white">PENERBITAN</span>
          </h1>
          <p className="text-xl md:text-2xl text-yellow-100 font-light mb-8">Wujudkan Impian Menerbitkan Buku Anda Bersama Kami</p>
          <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
        </div>
      </div>
    </header>
  );
}
