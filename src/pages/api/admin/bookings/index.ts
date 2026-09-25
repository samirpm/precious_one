import type { APIRoute } from 'astro';
import { redirectWithError, formToObject, requireAdmin } from '@/lib/admin-api';
import { getAdminBookings, deleteBooking, updateBookingStatus } from '@/lib/services/booking.service';
import { BookingStatus } from '@prisma/client';

export const GET: APIRoute = async (ctx) => {
  try {
    requireAdmin(ctx);
    const bookings = await getAdminBookings();
    return new Response(JSON.stringify({ bookings }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
};

export const POST: APIRoute = async (ctx) => {
  try {
    requireAdmin(ctx);
    const formData = await ctx.request.formData();
    const action = ctx.url.searchParams.get('action');
    const id = ctx.url.searchParams.get('id');

    if (!id) throw new Error('Missing booking ID');

    if (action === 'delete') {
      await deleteBooking(id);
    } else if (action === 'update-status') {
      const status = formData.get('status') as BookingStatus;
      if (!status) throw new Error('Missing status');
      await updateBookingStatus(id, status);
    } else {
      throw new Error('Unknown action');
    }

    return ctx.redirect('/admin/bookings', 303);
  } catch (error) {
    return redirectWithError(ctx, '/admin/bookings', error);
  }
};
