import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  image: z.string().url(),
  date: z.preprocess((val) => new Date(val), z.date()),
  time: z.string().min(1),
  location: z.string().min(1),
  category: z.string().min(1),
  status: z.enum(["Upcoming", "Ongoing", "Completed", "Cancelled"]),
  organizer: z.string().min(1),
  registrationEnabled: z.boolean(),
  registrationTitle: z.string().optional(),
  registrationDescription: z.string().optional(),
  registrationButtonText: z.string().optional(),
  registrationLink: z.string().url().optional(),
  registrationDeadline: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid deadline format",
    }),
});

export const newsSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  image: z.string().url(),
  date: z.preprocess((val) => new Date(val), z.date()),
  category: z.string().min(1),
  status: z.enum(["draft", "published"]).default("draft"),
  author: z.string().min(1),
  published_at: z.coerce.date().nullable().optional(),
});

export const bookSchema = z.object({
  kode_buku: z.string().max(50).optional(),
  title: z.string().max(255, "Judul terlalu panjang"),
  isbn: z.string().max(50).optional(),
  penerbit: z.string().max(255).optional(),
  penulis: z.string(),
  editor: z.string().max(255).optional(),
  ukuran: z.string().max(50).optional(),
  halaman: z.string().max(10).optional(),
  image: z.string().url().optional(),
  kategori: z.string().max(100).optional(),
  sinopsis: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  published_at: z.coerce.date().nullable().optional(),
});
