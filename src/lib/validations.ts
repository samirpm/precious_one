import { z } from 'zod';

/** Form checkbox → boolean (checked boxes post 'on'). */
export const checkbox = z
  .union([z.boolean(), z.literal('on'), z.literal('true'), z.literal('1')])
  .transform((v) => v === true || v === 'on' || v === 'true' || v === '1');

/** Optional text that arrives as '' from an empty form field. */
const optionalText = (max = 2000) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === '' ? null : v));

/* ─── Auth ─── */

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

/* ─── Banners ─── */

export const bannerSchema = z.object({
  title: optionalText(200),
  subtitle: optionalText(300),
  imageUrl: z.string().trim().min(1).max(1000),
  buttonText: optionalText(100),
  buttonUrl: optionalText(1000),
  displayOrder: z.coerce.number().int().min(0).default(0),
  isActive: checkbox.default(true),
});

/* ─── Portfolio ─── */

export const portfolioSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: optionalText(2000),
  imageUrl: z.string().trim().min(1).max(1000),
  displayOrder: z.coerce.number().int().min(0).default(0),
  featured: checkbox.default(false),
  isActive: checkbox.default(true),
});

/* ─── Testimonials ─── */

export const testimonialSchema = z.object({
  quote: z.string().trim().min(1).max(2000),
  name: z.string().trim().min(1).max(120),
  role: z.string().trim().max(200).default(''),
  imageUrl: optionalText(1000),
  altText: z.string().trim().max(300).default(''),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  displayOrder: z.coerce.number().int().min(0).default(0),
  isActive: checkbox.default(true),
});

/* ─── Packages (pricing blocks under a service) ─── */

export const packageSchema = z.object({
  serviceId: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(120),
  description: optionalText(1000),
  price: z.coerce.number().min(0),
  currency: z.string().trim().min(1).max(8).default('AED'),
  note: optionalText(120),
  popular: checkbox.default(false),
  imageUrl: optionalText(1000),
  displayOrder: z.coerce.number().int().min(0).default(0),
  isActive: checkbox.default(true),
});

/* ─── Package details (features) ─── */

export const packageDetailSchema = z.object({
  packageId: z.string().uuid(),
  title: z.string().trim().min(1).max(300),
  description: optionalText(1000),
  // Not int-only: fractional values are used when reordering details.
  displayOrder: z.coerce.number().min(0).default(0),
});

/* ─── Services ─── */

export const serviceSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .min(1)
    .max(120),
  title: z.string().trim().min(1).max(200),
  shortTitle: z.string().trim().max(120).default(''),
  description: z.string().trim().max(2000).default(''),
  imageUrl: z.string().trim().min(1).max(1000),
  gallery: z.array(z.string().trim().min(1).max(1000)).default([]),
  longDescription: z.string().trim().max(8000).default(''),
  idealFor: z.string().trim().max(500).default(''),
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: checkbox.default(true),
});

/* ─── Bookings ─── */

export const bookingSchema = z.object({
  clientName: z.string().trim().min(1).max(100),
  clientEmail: z.string().trim().email(),
  clientPhone: z.string().trim().min(5).max(20),
  serviceId: z.string().uuid(),
  bookingDate: z.coerce.date(),
  bookingTime: z.string().trim().min(1),
  message: optionalText(1000),
});

/** Formats a ZodError into a single readable message. */
export function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join('.') || 'field'}: ${issue.message}`)
    .join('; ');
}
