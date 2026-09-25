import type { APIRoute } from 'astro';
import { redirectWithError, formToObject, requireAdmin } from '@/lib/admin-api';
import { bannerSchema } from '@/lib/validations';
import { getBanners, createBanner } from '@/lib/services/banner.service';
import { uploadFile } from '@/lib/upload-file';

export const GET: APIRoute = async () => {
  const banners = await getBanners();
  return new Response(JSON.stringify({ banners }), {
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
      imageUrl = await uploadFile(imageFile, 'banners');
    }

    const data = bannerSchema.parse({
      ...baseData,
      imageUrl,
    });

    await createBanner({
      title: data.title,
      subtitle: data.subtitle,
      imageUrl: data.imageUrl,
      buttonText: data.buttonText,
      buttonUrl: data.buttonUrl,
      displayOrder: data.displayOrder,
      isActive: data.isActive,
    });
    return ctx.redirect('/admin/banners', 303);
  } catch (error) {
    return redirectWithError(ctx, '/admin/banners', error);
  }
};
