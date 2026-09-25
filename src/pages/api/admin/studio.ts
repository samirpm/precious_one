import type { APIRoute } from 'astro';
import { z } from 'zod';
import { redirectWithError, formToObject, requireAdmin } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

const studioSchema = z.object({
  name: z.string().trim().min(1).max(200),
  tagline: z.string().trim().max(300).default(''),
  description: z.string().trim().max(2000).default(''),
  speciality: z.string().trim().max(4000).default(''),
  privacy: z.string().trim().max(4000).default(''),
  phone: z.string().trim().max(60).default(''),
  whatsapp: z.string().trim().max(60).default(''),
  email: z.string().trim().max(200).default(''),
  address: z.string().trim().max(300).default(''),
  openingHours: z.string().trim().max(200).default(''),
  instagram: z.string().trim().max(300).default(''),
  bookingMethod: z.enum(['whatsapp', 'phone', 'email', 'form']),
});

export const GET: APIRoute = async () => {
  const studio = await prisma.studioInfo.findUnique({ where: { id: 1 } });
  return new Response(JSON.stringify({ studio }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async (ctx) => {
  try {
    requireAdmin(ctx);
    const data = studioSchema.parse(formToObject(await ctx.request.formData()));
    await prisma.studioInfo.upsert({
      where: { id: 1 },
      update: { ...data },
      create: { id: 1, ...data },
    });
    return ctx.redirect('/admin/studio', 303);
  } catch (error) {
    return redirectWithError(ctx, '/admin/studio', error);
  }
};
