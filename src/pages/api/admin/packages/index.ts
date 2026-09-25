import type { APIRoute } from 'astro';
import { redirectWithError, formToObject, requireAdmin } from '@/lib/admin-api';
import { packageSchema } from '@/lib/validations';
import { getPackagesByService, createPackage } from '@/lib/services/package.service';
import { uploadFile } from '@/lib/upload-file';

export const GET: APIRoute = async ({ url }) => {
  const serviceId = url.searchParams.get('serviceId');
  if (!serviceId) {
    return new Response(JSON.stringify({ error: 'serviceId is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const packages = await getPackagesByService(serviceId);
  return new Response(JSON.stringify({ packages }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async (ctx) => {
  const serviceId = ctx.url.searchParams.get('serviceId') ?? '';
  const backUrl = serviceId ? `/admin/services/${serviceId}/packages` : '/admin/services';

  try {
    requireAdmin(ctx);
    const formData = await ctx.request.formData();
    const imageFile = formData.get('imageFile');

    const baseData = formToObject(formData);
    let imageUrl = baseData.imageUrl as string;

    if (imageFile instanceof File && imageFile.name) {
      imageUrl = await uploadFile(imageFile, 'packages');
    }

    const data = packageSchema.parse({
      ...baseData,
      serviceId, // Ensure serviceId from URL is used
      imageUrl,
    });

    await createPackage({
      service: { connect: { id: data.serviceId } },
      slug: data.slug,
      name: data.name,
      description: data.description,
      price: data.price,
      currency: data.currency,
      note: data.note,
      popular: data.popular,
      imageUrl: data.imageUrl,
      displayOrder: data.displayOrder,
      isActive: data.isActive,
    });
    return ctx.redirect(backUrl, 303);
  } catch (error) {
    return redirectWithError(ctx, backUrl, error);
  }
};
