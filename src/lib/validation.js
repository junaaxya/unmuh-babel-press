import { z } from 'zod';

// Skema untuk Berita (News)
export const newsSchema = z.object({
    title: z.string().min(1, { message: "Judul tidak boleh kosong" }),
    excerpt: z.string().min(1, { message: "Ringkasan tidak boleh kosong" }),
    content: z.string().min(1, { message: "Konten tidak boleh kosong" }),
    image: z.string().url({ message: "URL gambar tidak valid" }),
    date: z.preprocess((val) => (val ? new Date(val) : new Date()), z.date()),
    category: z.string().min(1, { message: "Kategori tidak boleh kosong" }),
    author: z.string().min(1, { message: "Penulis tidak boleh kosong" }),
});


// Skema untuk Event dengan validasi kondisional yang cerdas
export const eventSchema = z.object({
    // Field dasar yang selalu wajib
    title: z.string().min(1, { message: "Judul tidak boleh kosong" }),
    excerpt: z.string().min(1, { message: "Ringkasan tidak boleh kosong" }),
    content: z.string().min(1, { message: "Konten tidak boleh kosong" }),
    image: z.string().url({ message: "URL gambar tidak valid" }).min(1, { message: "Gambar wajib diunggah" }),
    date: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "Format tanggal tidak valid" }),
    time: z.string().min(1, { message: "Waktu tidak boleh kosong" }),
    location: z.string().min(1, { message: "Lokasi tidak boleh kosong" }),
    category: z.string(),
    status: z.enum(["Upcoming", "Ongoing", "Completed", "Cancelled"]),
    organizer: z.string().min(1, { message: "Penyelenggara tidak boleh kosong" }),
    
    // Field registrasi
    registrationEnabled: z.boolean(),
    
    // Field-field ini dibuat opsional dan bisa menerima null di level dasar
    registrationTitle: z.string().optional(),
    registrationDescription: z.string().optional(),
    registrationButtonText: z.string().optional(),
    registrationLink: z.string().url({ message: "URL registrasi tidak valid" }).nullable().optional(),
    // Menerima string tanggal-waktu atau null/undefined
    registrationDeadline: z.string().datetime({ offset: true, message: "Format batas waktu tidak valid" }).nullable().optional(),

}).superRefine((data, ctx) => {
    // Hanya jalankan validasi ini JIKA registrationEnabled adalah true.
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
        // Anda bisa menambahkan validasi lain di sini jika perlu
        // contoh:
        // if (!data.registrationButtonText || data.registrationButtonText.trim() === '') { ... }
    }
});
