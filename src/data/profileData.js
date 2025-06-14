// data/profileData.js
export const profileData = {
  hero: {
    title: "Unmuh Babel Press",
    subtitle: "Penerbit Resmi Universitas Muhammadiyah Babel",
    description: "Menyebarkan ilmu pengetahuan dan nilai-nilai Islam melalui karya-karya berkualitas untuk kemajuan pendidikan dan masyarakat.",
    stats: [
      { number: 13, label: "Buku Diterbitkan", suffix: "+", icon: "fa-book" },
      { number: 11, label: "Penulis Tergabung", suffix: "+", icon: "fa-users" },
      { number: 8, label: "Tahun Beroperasi", suffix: "", icon: "fa-calendar" },
      { number: 50, label: "Kerjasama Institusi", suffix: "+", icon: "fa-handshake" }
    ]
  },
  
  visionMission: {
    vision: "Menjadi penerbit terdepan dalam menyebarkan ilmu pengetahuan dan nilai-nilai Islam yang berkualitas tinggi di tingkat nasional dan internasional.",
    missions: [
      "Menerbitkan karya-karya ilmiah berkualitas tinggi dari civitas akademika dan masyarakat umum",
      "Menyebarkan nilai-nilai Islam dan kearifan lokal melalui publikasi yang bermutu",
      "Mendukung pengembangan ilmu pengetahuan dan teknologi melalui penerbitan",
      "Memberikan layanan penerbitan yang profesional dan terpercaya",
      "Membangun jaringan kerjasama dengan penerbit dan institusi pendidikan lainnya"
    ]
  },
  
  history: [
    {
      year: "2015",
      title: "Pendirian Unmuh Babel Press",
      description: "Didirikan sebagai unit penerbitan resmi Universitas Muhammadiyah Babel untuk mendukung publikasi karya ilmiah civitas akademika."
    },
    {
      year: "2017",
      title: "Ekspansi Layanan",
      description: "Mulai melayani penerbitan dari luar universitas dan membangun kerjasama dengan berbagai institusi pendidikan."
    },
    {
      year: "2019",
      title: "Digitalisasi Platform",
      description: "Meluncurkan platform digital untuk memudahkan proses penerbitan dan distribusi buku elektronik."
    },
    {
      year: "2021",
      title: "Sertifikasi ISBN",
      description: "Memperoleh sertifikasi resmi sebagai penerbit ISBN dari Perpustakaan Nasional RI."
    },
    {
      year: "2023",
      title: "Penghargaan Nasional",
      description: "Meraih penghargaan sebagai penerbit terbaik kategori universitas dari Ikatan Penerbit Indonesia (IKAPI)."
    }
  ],
  
  team: [
    {
      name: "Dr. Ahmad Fauzi, M.Pd",
      position: "Direktur Penerbit",
      image: "/images/team/director.jpg",
      description: "Memimpin dan mengawasi seluruh operasional penerbitan dengan pengalaman 15 tahun di bidang publikasi akademik."
    },
    {
      name: "Siti Nurjanah, S.S., M.Hum",
      position: "Editor in Chief",
      image: "/images/team/editor.jpg",
      description: "Bertanggung jawab atas kualitas editorial dan standar penerbitan semua publikasi."
    },
    {
      name: "Budi Santoso, S.Kom",
      position: "Manajer Produksi",
      image: "/images/team/production.jpg",
      description: "Mengelola proses produksi dari naskah hingga buku siap distribusi."
    },
    {
      name: "Rina Maharani, S.E",
      position: "Manajer Pemasaran",
      image: "/images/team/marketing.jpg",
      description: "Mengembangkan strategi pemasaran dan membangun jaringan distribusi nasional."
    }
  ],
  
  contact: {
    address: {
      street: "Gedung Rektorat Lt.3, Universitas Muhammadiyah Bangka Belitung, Jl. KH Ahmad Dahlan, Keramat, Rangkui",
      city: "Pangkalpinang",
      province: "Kepulauan Bangka Belitung",
      postal: "33138",
      icon: "fa-map-marker-alt"
    },
    phone: {
      number: "+62 821-7122-2017",
      whatsapp: "+62 821-7122-2017",
      icon: "fa-phone"
    },
    email: {
      general: "ubp@unmuhbabel.ac.id",
      submission: "ubp@unmuhbabel.ac.id",
      icon: "fa-envelope"
    },
    social: [
      { platform: "Facebook", url: "https://facebook.com/unmuhbabelpress", icon: "fa-facebook" },
      { platform: "Instagram", url: "https://instagram.com/unmuhbabelpress", icon: "fa-instagram" },
      { platform: "Twitter", url: "https://twitter.com/unmuhbabelpress", icon: "fa-twitter" },
      { platform: "LinkedIn", url: "https://linkedin.com/company/unmuhbabelpress", icon: "fa-linkedin" }
    ],
    hours: {
      weekdays: "Senin - Jumat: 08.00 - 16.00 WIB",
      weekend: "Sabtu: 08.00 - 12.00 WIB",
      closed: "Minggu: Tutup",
      icon: "fa-clock"
    }
  },
  
  services: [
    {
      title: "Penerbitan Buku Akademik",
      description: "Layanan penerbitan untuk buku-buku akademik, penelitian, dan karya ilmiah dengan standar internasional.",
      icon: "fa-graduation-cap",
      features: ["Peer Review", "ISBN Registration", "Quality Editing", "Professional Design"]
    },
    {
      title: "Penerbitan Umum",
      description: "Penerbitan untuk karya sastra, buku populer, dan publikasi umum dengan kualitas terjamin.",
      icon: "fa-book-open",
      features: ["Creative Editing", "Marketing Support", "Distribution Network", "Royalty System"]
    },
    {
      title: "Digital Publishing",
      description: "Layanan penerbitan digital untuk e-book dan publikasi online dengan teknologi terkini.",
      icon: "fa-tablet-alt",
      features: ["E-book Format", "Online Distribution", "DRM Protection", "Analytics Dashboard"]
    },
    {
      title: "Self Publishing",
      description: "Platform untuk penulis mandiri yang ingin menerbitkan karya dengan dukungan penuh.",
      icon: "fa-user-edit",
      features: ["Easy Upload", "Custom Design", "Print on Demand", "Author Dashboard"]
    }
  ]
};