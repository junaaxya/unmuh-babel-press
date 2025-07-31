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
  author: z.string().min(1),
});
