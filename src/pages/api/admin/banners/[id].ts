import type { APIRoute } from 'astro';
import { redirectWithError, formToObject, requireAdmin } from '@/lib/admin-api';
import { bannerSchema } from '@/lib/validations';
import {
  updateBanner,
  deleteBanner,
  toggleBanner,
  moveBanner,
} from '@/lib/services/banner.service';
import { uploadFile } from '@/lib/upload-file';

const BACK = '/admin/banners';

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
        imageUrl = await uploadFile(imageFile, 'banners');
      }

      const data = bannerSchema.parse({
        ...baseData,
        imageUrl,
      });

      await updateBanner(id, {
        title: data.title,
        subtitle: data.subtitle,
        imageUrl: data.imageUrl,
        buttonText: data.buttonText,
        buttonUrl: data.buttonUrl,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      });
    } else if (action === 'toggle') {
      await toggleBanner(id);
    } else if (action === 'move') {
      const fd = await ctx.request.formData();
      const direction = fd.get('direction') === 'down' ? 'down' : 'up';
      await moveBanner(id, direction);
    } else if (action === 'delete') {
      await deleteBanner(id);
    } else {
      return redirectWithError(ctx, BACK, new Error('Unknown banner action.'));
    }

    return redirect(BACK, 303);
  } catch (error) {
    return redirectWithError(ctx, BACK, error);
  }
};
