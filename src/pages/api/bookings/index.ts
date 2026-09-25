import type { APIRoute } from 'astro';
import { redirectWithError, formToObject } from '@/lib/admin-api';
import { bookingSchema } from '@/lib/validations';
import { createBooking } from '@/lib/services/booking.service';

export const POST: APIRoute = async (ctx) => {
  try {
    const data = bookingSchema.parse(formToObject(await ctx.request.formData()));

    await createBooking({
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      serviceId: data.serviceId,
      bookingDate: data.bookingDate,
      bookingTime: data.bookingTime,
      message: data.message,
    });

    return new Response(JSON.stringify({ message: 'Booking request sent successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Invalid booking data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
