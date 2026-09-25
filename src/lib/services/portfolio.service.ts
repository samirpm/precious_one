import { prisma } from '@/lib/prisma';
import { HttpError } from '@/lib/errors';
import type { Prisma } from '@prisma/client';

const MIN_IMAGES = 10;
const MAX_IMAGES = 30;

export async function getPortfolioImages(options?: { activeOnly?: boolean }) {
  return prisma.portfolioImage.findMany({
    where: options?.activeOnly ? { isActive: true } : undefined,
    orderBy: { displayOrder: 'asc' },
  });
}

export async function getPortfolioImage(id: string) {
  const image = await prisma.portfolioImage.findUnique({ where: { id } });
  if (!image) throw new HttpError(404, 'Portfolio image not found.');
  return image;
}

export async function createPortfolioImage(data: Prisma.PortfolioImageCreateInput) {
  return prisma.$transaction(async (tx) => {
    const count = await tx.portfolioImage.count();
    if (count >= MAX_IMAGES) {
      throw new HttpError(409, 'Maximum 30 portfolio images allowed.');
    }
    return tx.portfolioImage.create({ data });
  });
}

export async function updatePortfolioImage(
  id: string,
  data: Prisma.PortfolioImageUpdateInput,
) {
  await getPortfolioImage(id);
  return prisma.portfolioImage.update({ where: { id }, data });
}

export async function deletePortfolioImage(id: string) {
  await prisma.$transaction(async (tx) => {
    const count = await tx.portfolioImage.count();
    if (count <= MIN_IMAGES) {
      throw new HttpError(409, 'At least 10 portfolio images are required.');
    }
    const image = await tx.portfolioImage.findUnique({ where: { id } });
    if (!image) throw new HttpError(404, 'Portfolio image not found.');
    await tx.portfolioImage.delete({ where: { id } });
  });
}

export async function togglePortfolioImage(id: string) {
  const image = await getPortfolioImage(id);
  return prisma.portfolioImage.update({
    where: { id },
    data: { isActive: !image.isActive },
  });
}

export async function togglePortfolioFeatured(id: string) {
  const image = await getPortfolioImage(id);
  return prisma.portfolioImage.update({
    where: { id },
    data: { featured: !image.featured },
  });
}

export async function movePortfolioImage(id: string, direction: 'up' | 'down') {
  const all = await prisma.portfolioImage.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
  });
  const index = all.findIndex((img) => img.id === id);
  if (index === -1) throw new HttpError(404, 'Portfolio image not found.');
  const swapWith = direction === 'up' ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= all.length) return;
  const a = all[index];
  const b = all[swapWith];
  const valueA = a.displayOrder === b.displayOrder ? swapWith + 1 : b.displayOrder;
  const valueB = a.displayOrder === b.displayOrder ? index + 1 : a.displayOrder;
  await prisma.$transaction([
    prisma.portfolioImage.update({ where: { id: a.id }, data: { displayOrder: valueA } }),
    prisma.portfolioImage.update({ where: { id: b.id }, data: { displayOrder: valueB } }),
  ]);
}
