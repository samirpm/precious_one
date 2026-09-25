import type { APIRoute } from 'astro';
import { redirectWithError, formToObject, requireAdmin } from '@/lib/admin-api';
import { packageDetailSchema } from '@/lib/validations';
import {
  getPackageDetails,
  createPackageDetail,
} from '@/lib/services/package.service';

export const GET: APIRoute = async ({ params }) => {
  const details = await getPackageDetails(params.id as string);
  return new Response(JSON.stringify({ details }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async (ctx) => {
  const packageId = ctx.params.id as string;
  const serviceId = ctx.url.searchParams.get('serviceId') ?? '';
  const backUrl = serviceId
    ? `/admin/services/${serviceId}/packages#${packageId}`
    : '/admin/services';

  try {
    requireAdmin(ctx);
    const data = packageDetailSchema.parse({
      ...formToObject(await ctx.request.formData()),
      packageId,
    });
    await createPackageDetail({
      package: { connect: { id: data.packageId } },
      title: data.title,
      description: data.description,
      displayOrder: data.displayOrder,
    });
    return ctx.redirect(backUrl, 303);
  } catch (error) {
    return redirectWithError(ctx, backUrl, error);
  }
};
