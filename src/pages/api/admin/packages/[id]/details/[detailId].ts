import type { APIRoute } from 'astro';
import { redirectWithError, formToObject, requireAdmin } from '@/lib/admin-api';
import { packageDetailSchema } from '@/lib/validations';
import {
  updatePackageDetail,
  deletePackageDetail,
} from '@/lib/services/package.service';

export const POST: APIRoute = async (ctx) => {
  const { params, url, redirect } = ctx;
  const detailId = params.detailId as string;
  const serviceId = url.searchParams.get('serviceId') ?? '';
  const packageId = params.id as string;
  const backUrl = serviceId
    ? `/admin/services/${serviceId}/packages#${packageId}`
    : '/admin/services';

  try {
    requireAdmin(ctx);
    const action = url.searchParams.get('action') ?? '';

    if (action === 'update') {
      const data = packageDetailSchema.parse({
        ...formToObject(await ctx.request.formData()),
        packageId,
      });
      await updatePackageDetail(detailId, {
        title: data.title,
        description: data.description,
        displayOrder: data.displayOrder,
      });
    } else if (action === 'delete') {
      await deletePackageDetail(detailId);
    } else {
      return redirectWithError(ctx, backUrl, new Error('Unknown package detail action.'));
    }

    return redirect(backUrl, 303);
  } catch (error) {
    return redirectWithError(ctx, backUrl, error);
  }
};
