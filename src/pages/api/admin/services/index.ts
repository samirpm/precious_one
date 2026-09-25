import type { APIRoute } from 'astro';
import { redirectWithError, formToObject, requireAdmin } from '@/lib/admin-api';
import { serviceSchema } from '@/lib/validations';
import { getServices, createService } from '@/lib/services/service.service';
import { uploadFile } from '@/lib/upload-file';

export const GET: APIRoute = async () => {
  const services = await getServices();
  return new Response(JSON.stringify({ services }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async (ctx) => {
  try {
    requireAdmin(ctx);
    const formData = await ctx.request.formData();
    const imageFile = formData.get('imageFile');

    const baseData = formToObject(formData);
    let imageUrl = baseData.imageUrl as string;

    if (imageFile instanceof File && imageFile.name) {
      imageUrl = await uploadFile(imageFile, 'services');
    }

    const data = serviceSchema.parse({
      ...baseData,
      imageUrl,
    });

    await createService({
      slug: data.slug,
      title: data.title,
      shortTitle: data.shortTitle,
      description: data.description,
      category: data.category,
      imageUrl: data.imageUrl,
      gallery: data.gallery,
      longDescription: data.longDescription,
      idealFor: data.idealFor,
      sortOrder: data.sortOrder,
      published: data.published,
    });
    return ctx.redirect('/admin/services', 303);
  } catch (error) {
    return redirectWithError(ctx, '/admin/services', error);
  }
};
