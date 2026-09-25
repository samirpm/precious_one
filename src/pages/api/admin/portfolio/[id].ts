import type { APIRoute } from 'astro';
import { redirectWithError, formToObject, requireAdmin } from '@/lib/admin-api';
import { portfolioSchema } from '@/lib/validations';
import {
  updatePortfolioImage,
  deletePortfolioImage,
  togglePortfolioImage,
  togglePortfolioFeatured,
  movePortfolioImage,
} from '@/lib/services/portfolio.service';
import { uploadFile } from '@/lib/upload-file';

const BACK = '/admin/portfolio';

export const POST: APIRoute = async (ctx) => {
  const { params, url, redirect } = ctx;
  const id = params.id as string;
  const action = url.searchParams.get('action') ?? '';

  try {
    requireAdmin(ctx);

    if (action === 'update') {
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

      await updatePortfolioImage(id, {
        title: data.title,
        category: data.category,
        description: data.description,
        imageUrl: data.imageUrl,
        displayOrder: data.displayOrder,
        featured: data.featured,
        isActive: data.isActive,
      });
    } else if (action === 'toggle') {
      await togglePortfolioImage(id);
    } else if (action === 'toggle-featured') {
      await togglePortfolioFeatured(id);
    } else if (action === 'move') {
      const fd = await ctx.request.formData();
      const direction = fd.get('direction') === 'down' ? 'down' : 'up';
      await movePortfolioImage(id, direction);
    } else if (action === 'delete') {
      await deletePortfolioImage(id);
    } else {
      return redirectWithError(ctx, BACK, new Error('Unknown portfolio action.'));
    }

    return redirect(BACK, 303);
  } catch (error) {
    return redirectWithError(ctx, BACK, error);
  }
};
