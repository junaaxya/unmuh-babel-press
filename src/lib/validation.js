import { z } from 'zod';

// Skema untuk Berita (News)
export const newsSchema = z.object({
  title: z.string().min(1, { message: "Judul tidak boleh kosong" }),
  excerpt: z.string().min(1, { message: "Ringkasan tidak boleh kosong" }),
  content: z.string().min(1, { message: "Konten tidak boleh kosong" }),
  // FIX: terima path lokal /uploads/... dan URL https://...
  image: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
    z.string().min(1, { message: "Gambar wajib diunggah" })
  ),
  date: z.preprocess((val) => (val ? new Date(val) : new Date()), z.date()),
  category: z.string().min(1, { message: "Kategori tidak boleh kosong" }),
  status: z.enum(["draft", "published"]).default("draft"),
  author: z.string().min(1, { message: "Penulis tidak boleh kosong" }),
  published_at: z.coerce.date().nullable().optional(),
});

// Skema untuk Event dengan validasi kondisional yang cerdas
export const eventSchema = z.object({
  // Field dasar yang selalu wajib
  title: z.string().min(1, { message: "Judul tidak boleh kosong" }),
  excerpt: z.string().min(1, { message: "Ringkasan tidak boleh kosong" }),
  content: z.string().min(1, { message: "Konten tidak boleh kosong" }),
  // FIX: terima path lokal /uploads/... dan URL https://...
  image: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
    z.string().min(1, { message: "Gambar wajib diunggah" })
  ),
  date: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "Format tanggal tidak valid" }),
  time: z.string().min(1, { message: "Waktu tidak boleh kosong" }),
  location: z.string().min(1, { message: "Lokasi tidak boleh kosong" }),
  category: z.string(),
  publishStatus: z.string().optional(),
  status: z.enum(["Upcoming", "Ongoing", "Completed", "Cancelled"]),
  organizer: z.string().min(1, { message: "Penyelenggara tidak boleh kosong" }),
  registrationEnabled: z.boolean(),
  registrationTitle: z.string().optional(),
  registrationDescription: z.string().optional(),
  registrationButtonText: z.string().optional(),
  registrationLink: z.preprocess(
    (val) => {
      if (typeof val === 'string' && val.trim() === '') return null;
      return val;
    },
    z.string().url({ message: "URL registrasi tidak valid" }).nullable().optional()
  ),
  registrationDeadline: z.preprocess(
        (arg) => {
            // Jika input kosong atau tidak ada, anggap sebagai null.
            if (arg === '' || arg === null || arg === undefined) {
                return null;
            }
            return arg;
        },
        // Coba ubah string menjadi objek Date. Jika gagal, akan muncul error.
        z.coerce.date({
            errorMap: () => ({ message: 'Format batas waktu tidak valid.' })
        }).nullable()
    ),
}).superRefine((data, ctx) => {
  if (data.registrationEnabled) {
    if (!data.registrationTitle || data.registrationTitle.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['registrationTitle'],
        message: 'Judul registrasi wajib diisi jika registrasi diaktifkan',
      });
    }
    if (!data.registrationLink || data.registrationLink.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['registrationLink'],
        message: 'Link registrasi wajib diisi jika registrasi diaktifkan',
      });
    }
    // tambahan validasi bisa ditaruh di sini
  }
});

// Skema untuk Buku (Book)
export const bookSchema = z.object({
  kode_buku: z.string().max(50).optional(),
  title: z.string().min(1, "Judul tidak boleh kosong").max(255, "Judul terlalu panjang"),
  isbn: z.string().max(50).optional(),
  penerbit: z.string().max(255).optional(),
  penulis: z.string().min(1, "Penulis tidak boleh kosong"),
  editor: z.string().max(255).optional(),
  ukuran: z.string().max(50).optional(),
  
  // --- PERBAIKAN DI SINI ---
  // Mengubah dari z.string() menjadi z.coerce.number() agar Zod
  // otomatis mengubah string dari form menjadi angka.
  halaman: z.coerce.number({
        errorMap: () => ({ message: "Jumlah halaman harus berupa angka." })
  }).positive("Jumlah halaman harus positif.").optional(),

  // FIX: terima path lokal /uploads/... dan URL https://...
  image: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
    z.string().optional()
  ),

  kategori: z.string().max(100).optional(),
  sinopsis: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  published_at: z.coerce.date().nullable().optional(),

  // Tambahan field google_books_url
  google_books_url: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
    z.string().url("Format URL Google Books tidak valid").optional()
  ),
});