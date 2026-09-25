import { prisma } from '@/lib/prisma';
import { HttpError } from '@/lib/errors';
import type { Prisma } from '@prisma/client';

/* ─── Packages ─── */

export async function getPackagesByService(serviceId: string) {
  return prisma.package.findMany({
    where: { serviceId },
    orderBy: { displayOrder: 'asc' },
    include: { details: { orderBy: { displayOrder: 'asc' } } },
  });
}

export async function getPackage(id: string) {
  const pkg = await prisma.package.findUnique({ where: { id } });
  if (!pkg) throw new HttpError(404, 'Package not found.');
  return pkg;
}

export async function createPackage(data: Prisma.PackageCreateInput) {
  return prisma.package.create({ data });
}

export async function updatePackage(id: string, data: Prisma.PackageUpdateInput) {
  await getPackage(id);
  return prisma.package.update({ where: { id }, data });
}

export async function deletePackage(id: string) {
  await getPackage(id);
  // Details cascade-delete (schema-level onDelete: Cascade).
  await prisma.package.delete({ where: { id } });
}

export async function togglePackage(id: string) {
  const pkg = await getPackage(id);
  return prisma.package.update({
    where: { id },
    data: { isActive: !pkg.isActive },
  });
}

/* ─── Package details (features) ─── */

export async function getPackageDetails(packageId: string) {
  return prisma.packageDetail.findMany({
    where: { packageId },
    orderBy: { displayOrder: 'asc' },
  });
}

export async function getPackageDetail(id: string) {
  const detail = await prisma.packageDetail.findUnique({ where: { id } });
  if (!detail) throw new HttpError(404, 'Package detail not found.');
  return detail;
}

export async function createPackageDetail(data: Prisma.PackageDetailCreateInput) {
  return prisma.packageDetail.create({ data });
}

export async function updatePackageDetail(
  id: string,
  data: Prisma.PackageDetailUpdateInput,
) {
  await getPackageDetail(id);
  return prisma.packageDetail.update({ where: { id }, data });
}

export async function deletePackageDetail(id: string) {
  await getPackageDetail(id);
  await prisma.packageDetail.delete({ where: { id } });
}
