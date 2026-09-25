import type { APIRoute } from 'astro';
import { redirectWithError, formToObject, requireAdmin } from '@/lib/admin-api';
import { testimonialSchema } from '@/lib/validations';
import { getTestimonials, createTestimonial } from '@/lib/services/testimonial.service';
import { uploadFile } from '@/lib/upload-file';

export const GET: APIRoute = async () => {
  const testimonials = await getTestimonials();
  return new Response(JSON.stringify({ testimonials }), {
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
      imageUrl = await uploadFile(imageFile, 'testimonials');
    }

    const data = testimonialSchema.parse({
      ...baseData,
      imageUrl,
    });

    await createTestimonial({
      quote: data.quote,
      name: data.name,
      role: data.role,
      imageUrl: data.imageUrl,
      altText: data.altText,
      rating: data.rating,
      displayOrder: data.displayOrder,
      isActive: data.isActive,
    });
    return ctx.redirect('/admin/testimonials', 303);
  } catch (error) {
    return redirectWithError(ctx, '/admin/testimonials', error);
  }
};
