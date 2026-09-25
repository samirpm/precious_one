import { PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma client.
 * Reused across requests (and hot reloads in dev) instead of being
 * re-instantiated per request.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: import.meta.env?.DEV ? ['warn', 'error'] : ['error'],
  });

if (import.meta.env?.DEV) {
  globalForPrisma.prisma = prisma;
}
