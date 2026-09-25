import { prisma } from '@/lib/prisma';
import { HttpError } from '@/lib/errors';
import type { Prisma } from '@prisma/client';

const MIN_BANNERS = 3;
const MAX_BANNERS = 5;

export async function getBanners(options?: { activeOnly?: boolean }) {
  return prisma.banner.findMany({
    where: options?.activeOnly ? { isActive: true } : undefined,
    orderBy: { displayOrder: 'asc' },
  });
}

export async function getBanner(id: string) {
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) throw new HttpError(404, 'Banner not found.');
  return banner;
}

export async function createBanner(data: Prisma.BannerCreateInput) {
  return prisma.$transaction(async (tx) => {
    const count = await tx.banner.count();
    if (count >= MAX_BANNERS) {
      throw new HttpError(409, 'Maximum 5 banners allowed.');
    }
    return tx.banner.create({ data });
  });
}

export async function updateBanner(id: string, data: Prisma.BannerUpdateInput) {
  await getBanner(id);
  return prisma.banner.update({ where: { id }, data });
}

export async function deleteBanner(id: string) {
  await prisma.$transaction(async (tx) => {
    const count = await tx.banner.count();
    if (count <= MIN_BANNERS) {
      throw new HttpError(409, 'At least 3 banners are required.');
    }
    const banner = await tx.banner.findUnique({ where: { id } });
    if (!banner) throw new HttpError(404, 'Banner not found.');
    await tx.banner.delete({ where: { id } });
  });
}

export async function toggleBanner(id: string) {
  const banner = await getBanner(id);
  return prisma.banner.update({ where: { id }, data: { isActive: !banner.isActive } });
}

export async function moveBanner(id: string, direction: 'up' | 'down') {
  const all = await prisma.banner.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
  });
  const index = all.findIndex((b) => b.id === id);
  if (index === -1) throw new HttpError(404, 'Banner not found.');
  const swapWith = direction === 'up' ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= all.length) return;
  const a = all[index];
  const b = all[swapWith];
  // Break ties with positional values so swaps always have an effect.
  const valueA = a.displayOrder === b.displayOrder ? swapWith + 1 : b.displayOrder;
  const valueB = a.displayOrder === b.displayOrder ? index + 1 : a.displayOrder;
  await prisma.$transaction([
    prisma.banner.update({ where: { id: a.id }, data: { displayOrder: valueA } }),
    prisma.banner.update({ where: { id: b.id }, data: { displayOrder: valueB } }),
  ]);
}
