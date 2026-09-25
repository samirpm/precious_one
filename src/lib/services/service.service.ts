import { prisma } from '@/lib/prisma';
import { HttpError } from '@/lib/errors';
import type { Prisma } from '@prisma/client';

export async function getServices(options?: { activeOnly?: boolean }) {
  return prisma.service.findMany({
    where: options?.activeOnly ? { published: true } : undefined,
    orderBy: { sortOrder: 'asc' },
    include: { packages: { orderBy: { displayOrder: 'asc' } } },
  });
}

export async function getServiceBySlug(slug: string, options?: { activeOnly?: boolean }) {
  const service = await prisma.service.findFirst({
    where: { slug, ...(options?.activeOnly ? { published: true } : {}) },
    include: {
      packages: {
        where: options?.activeOnly ? { isActive: true } : undefined,
        orderBy: { displayOrder: 'asc' },
        include: { details: { orderBy: { displayOrder: 'asc' } } },
      },
    },
  });
  if (!service) throw new HttpError(404, 'Service not found.');
  return service;
}

export async function getService(id: string) {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) throw new HttpError(404, 'Service not found.');
  return service;
}

export async function createService(data: Prisma.ServiceCreateInput) {
  return prisma.service.create({ data });
}

export async function updateService(id: string, data: Prisma.ServiceUpdateInput) {
  await getService(id);
  return prisma.service.update({ where: { id }, data });
}

export async function deleteService(id: string) {
  await getService(id);
  // Packages + details cascade-delete (schema-level onDelete: Cascade).
  await prisma.service.delete({ where: { id } });
}

export async function toggleServicePublished(id: string) {
  const service = await getService(id);
  return prisma.service.update({
    where: { id },
    data: { published: !service.published },
  });
}

export async function moveService(id: string, direction: 'up' | 'down') {
  const all = await prisma.service.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
  const index = all.findIndex((s) => s.id === id);
  if (index === -1) throw new HttpError(404, 'Service not found.');
  const swapWith = direction === 'up' ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= all.length) return;
  const a = all[index];
  const b = all[swapWith];
  const valueA = a.sortOrder === b.sortOrder ? swapWith + 1 : b.sortOrder;
  const valueB = a.sortOrder === b.sortOrder ? index + 1 : a.sortOrder;
  await prisma.$transaction([
    prisma.service.update({ where: { id: a.id }, data: { sortOrder: valueA } }),
    prisma.service.update({ where: { id: b.id }, data: { sortOrder: valueB } }),
  ]);
}
