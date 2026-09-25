import type { APIRoute } from 'astro';
import { redirectWithError, formToObject, requireAdmin } from '@/lib/admin-api';
import { packageSchema } from '@/lib/validations';
import {
  updatePackage,
  deletePackage,
  togglePackage,
} from '@/lib/services/package.service';
import { uploadFile } from '@/lib/upload-file';

export const POST: APIRoute = async (ctx) => {
  const { params, url, redirect } = ctx;
  const id = params.id as string;
  const action = url.searchParams.get('action') ?? '';
  const serviceId = url.searchParams.get('serviceId') ?? '';
  const backUrl = serviceId ? `/admin/services/${serviceId}/packages` : '/admin/services';

  try {
    requireAdmin(ctx);

    if (action === 'update') {
      const formData = await ctx.request.formData();
      const imageFile = formData.get('imageFile');

      const baseData = formToObject(formData);
      let imageUrl = baseData.imageUrl as string;

      if (imageFile instanceof File && imageFile.name) {
        imageUrl = await uploadFile(imageFile, 'packages');
      }

      const data = packageSchema.parse({
        ...baseData,
        serviceId,
        imageUrl,
      });

      await updatePackage(id, {
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
    } else if (action === 'toggle') {
      await togglePackage(id);
    } else if (action === 'delete') {
      // Details cascade-delete with the package.
      await deletePackage(id);
    } else {
      return redirectWithError(ctx, backUrl, new Error('Unknown package action.'));
    }

    return redirect(backUrl, 303);
  } catch (error) {
    return redirectWithError(ctx, backUrl, error);
  }
};
