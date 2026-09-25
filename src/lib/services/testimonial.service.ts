import { prisma } from '@/lib/prisma';
import { HttpError } from '@/lib/errors';
import type { Prisma } from '@prisma/client';

export async function getTestimonials(options?: { activeOnly?: boolean }) {
  return prisma.testimonial.findMany({
    where: options?.activeOnly ? { isActive: true } : undefined,
    orderBy: { displayOrder: 'asc' },
  });
}

export async function getTestimonial(id: string) {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) throw new HttpError(404, 'Testimonial not found.');
  return testimonial;
}

export async function createTestimonial(data: Prisma.TestimonialCreateInput) {
  return prisma.testimonial.create({ data });
}

export async function updateTestimonial(
  id: string,
  data: Prisma.TestimonialUpdateInput,
) {
  await getTestimonial(id);
  return prisma.testimonial.update({ where: { id }, data });
}

export async function deleteTestimonial(id: string) {
  await getTestimonial(id);
  await prisma.testimonial.delete({ where: { id } });
}

export async function toggleTestimonial(id: string) {
  const testimonial = await getTestimonial(id);
  return prisma.testimonial.update({
    where: { id },
    data: { isActive: !testimonial.isActive },
  });
}

export async function moveTestimonial(id: string, direction: 'up' | 'down') {
  const all = await prisma.testimonial.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
  });
  const index = all.findIndex((t) => t.id === id);
  if (index === -1) throw new HttpError(404, 'Testimonial not found.');
  const swapWith = direction === 'up' ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= all.length) return;
  const a = all[index];
  const b = all[swapWith];
  const valueA = a.displayOrder === b.displayOrder ? swapWith + 1 : b.displayOrder;
  const valueB = a.displayOrder === b.displayOrder ? index + 1 : a.displayOrder;
  await prisma.$transaction([
    prisma.testimonial.update({ where: { id: a.id }, data: { displayOrder: valueA } }),
    prisma.testimonial.update({ where: { id: b.id }, data: { displayOrder: valueB } }),
  ]);
}
