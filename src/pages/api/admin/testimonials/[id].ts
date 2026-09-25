import type { APIRoute } from 'astro';
import { redirectWithError, formToObject, requireAdmin } from '@/lib/admin-api';
import { testimonialSchema } from '@/lib/validations';
import {
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonial,
  moveTestimonial,
} from '@/lib/services/testimonial.service';
import { uploadFile } from '@/lib/upload-file';

const BACK = '/admin/testimonials';

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
        imageUrl = await uploadFile(imageFile, 'testimonials');
      }

      const data = testimonialSchema.parse({
        ...baseData,
        imageUrl,
      });

      await updateTestimonial(id, {
        quote: data.quote,
        name: data.name,
        role: data.role,
        imageUrl: data.imageUrl,
        altText: data.altText,
        rating: data.rating,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      });
    } else if (action === 'toggle') {
      await toggleTestimonial(id);
    } else if (action === 'move') {
      const fd = await ctx.request.formData();
      const direction = fd.get('direction') === 'down' ? 'down' : 'up';
      await moveTestimonial(id, direction);
    } else if (action === 'delete') {
      await deleteTestimonial(id);
    } else {
      return redirectWithError(ctx, BACK, new Error('Unknown testimonial action.'));
    }

    return redirect(BACK, 303);
  } catch (error) {
    return redirectWithError(ctx, BACK, error);
  }
};
