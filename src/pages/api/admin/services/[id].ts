import type { APIRoute } from 'astro';
import { redirectWithError, formToObject, requireAdmin } from '@/lib/admin-api';
import { serviceSchema } from '@/lib/validations';
import {
  updateService,
  deleteService,
  toggleServicePublished,
  moveService,
} from '@/lib/services/service.service';
import { uploadFile } from '@/lib/upload-file';

const BACK = '/admin/services';

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
        imageUrl = await uploadFile(imageFile, 'services');
      }

      const data = serviceSchema.parse({
        ...baseData,
        imageUrl,
      });

      await updateService(id, {
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
    } else if (action === 'toggle') {
      await toggleServicePublished(id);
    } else if (action === 'move') {
      const fd = await ctx.request.formData();
      const direction = fd.get('direction') === 'down' ? 'down' : 'up';
      await moveService(id, direction);
    } else if (action === 'delete') {
      await deleteService(id);
    } else {
      return redirectWithError(ctx, BACK, new Error('Unknown service action.'));
    }

    return redirect(BACK, 303);
  } catch (error) {
    return redirectWithError(ctx, BACK, error);
  }
};
