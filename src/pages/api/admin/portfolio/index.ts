import type { APIRoute } from 'astro';
import { redirectWithError, formToObject, requireAdmin } from '@/lib/admin-api';
import { portfolioSchema } from '@/lib/validations';
import { getPortfolioImages, createPortfolioImage } from '@/lib/services/portfolio.service';
import { uploadFile } from '@/lib/upload-file';

export const GET: APIRoute = async () => {
  const images = await getPortfolioImages();
  return new Response(JSON.stringify({ images }), {
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
      imageUrl = await uploadFile(imageFile, 'portfolio');
    }

    const data = portfolioSchema.parse({
      ...baseData,
      imageUrl,
    });

    await createPortfolioImage({
      title: data.title,
      category: data.category,
      description: data.description,
      imageUrl: data.imageUrl,
      displayOrder: data.displayOrder,
      featured: data.featured,
      isActive: data.isActive,
    });
    return ctx.redirect('/admin/portfolio', 303);
  } catch (error) {
    return redirectWithError(ctx, '/admin/portfolio', error);
  }
};

