import type {
  StudioInfo,
  Service,
  ServicePackage,
  Photography,
  PhotographyCategory,
} from '@/types/photography';
import type { Testimonial } from '@/types/testimonial';
import { prisma } from '@/lib/prisma';

/* ─── Hero banner shape fed to the CinematicHero carousel ─── */

export interface HeroBanner {
  src: string;
  alt: string;
  label: string;
  buttonText: string;
  buttonUrl: string;
}

/* ─── Mappers: DB rows → site types ─── */

const formatPrice = (pkg: { currency: string; price: unknown }) =>
  `${pkg.currency} ${Number(pkg.price).toLocaleString('en-US')}`;

const mapServicePackage = (
  pkg: {
    name: string;
    price: unknown;
    currency: string;
    note: string | null;
    popular: boolean;
    details: Array<{ title: string }>;
  },
): ServicePackage => ({
  name: pkg.name,
  price: formatPrice(pkg),
  priceNote: pkg.note ?? undefined,
  popular: pkg.popular || undefined,
  features: pkg.details.map((d) => d.title),
});

const mapService = (row: {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  imageUrl: string;
  gallery: string[];
  longDescription: string;
  idealFor: string;
  packages: Array<Parameters<typeof mapServicePackage>[0]>;
}): Service => ({
  id: row.slug,
  title: row.title,
  shortTitle: row.shortTitle,
  description: row.description,
  imageUrl: row.imageUrl,
  gallery: row.gallery ?? [],
  longDescription: row.longDescription,
  idealFor: row.idealFor,
  packages: row.packages.map(mapServicePackage),
});

const mapPortfolio = (row: {
  id: string;
  title: string;
  imageUrl: string;
  description: string | null;
  displayOrder: number;
  featured: boolean;
}): Photography => ({
  id: row.id,
  title: row.title,
  imageUrl: row.imageUrl,
  description: row.description ?? undefined,
  order: row.displayOrder,
  featured: row.featured,
});

const mapTestimonial = (row: {
  id: string;
  quote: string;
  name: string;
  role: string;
  imageUrl: string | null;
  altText: string;
}): Testimonial => ({
  id: row.id,
  quote: row.quote,
  name: row.name,
  role: row.role,
  image: row.imageUrl ?? '',
  alt: row.altText,
});

const mapStudioInfo = (row: {
  name: string;
  tagline: string;
  description: string;
  speciality: string;
  privacy: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  openingHours: string;
  instagram: string;
  bookingMethod: string;
}): StudioInfo => ({
  name: row.name,
  tagline: row.tagline,
  description: row.description,
  speciality: row.speciality,
  privacy: row.privacy,
  phone: row.phone,
  whatsapp: row.whatsapp,
  email: row.email,
  address: row.address,
  openingHours: row.openingHours,
  instagram: row.instagram,
  bookingMethod: row.bookingMethod as StudioInfo['bookingMethod'],
});

/* ─── Queries (public site — active/published rows only) ─── */

export async function getBanners(): Promise<HeroBanner[]> {
  const rows = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });
  return rows.map((b) => ({
    src: b.imageUrl,
    alt: b.title,
    label: b.subtitle ?? b.title,
    buttonText: b.buttonText ?? 'Book a Session',
    buttonUrl: b.buttonUrl ?? '#contact',
  }));
}

export async function getServices(): Promise<Service[]> {
  const rows = await prisma.service.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      packages: {
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
        include: { details: { orderBy: { displayOrder: 'asc' } } },
      },
    },
  });
  return rows.map(mapService);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const row = await prisma.service.findFirst({
    where: { slug, published: true },
    include: {
      packages: {
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
        include: { details: { orderBy: { displayOrder: 'asc' } } },
      },
    },
  });
  return row ? mapService(row) : null;
}

export async function getPortfolio(): Promise<Photography[]> {
  const rows = await prisma.portfolioImage.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });
  return rows.map(mapPortfolio);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });
  return rows.map(mapTestimonial);
}

export async function getStudioInfo(): Promise<StudioInfo> {
  const row = await prisma.studioInfo.findUnique({ where: { id: 1 } });
  if (!row) {
    throw new Error('studio_info row missing — run `npx prisma db seed`.');
  }
  return mapStudioInfo(row);
}
