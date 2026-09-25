import { prisma } from '@/lib/prisma';
import type { Booking, BookingStatus } from '@prisma/client';

export async function createBooking(data: {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string;
  bookingDate: Date;
  bookingTime: string;
  message?: string;
}) {
  return await prisma.booking.create({
    data: {
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      serviceId: data.serviceId,
      bookingDate: data.bookingDate,
      bookingTime: data.bookingTime,
      message: data.message,
    },
  });
}

export async function getAdminBookings() {
  return await prisma.booking.findMany({
    include: {
      service: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  return await prisma.booking.update({
    where: { id },
    data: { status },
  });
}

export async function deleteBooking(id: string) {
  return await prisma.booking.delete({
    where: { id },
  });
}
