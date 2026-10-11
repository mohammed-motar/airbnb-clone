/**
 * We are creating this file with this name and not a file that is API routes,
 * this is because:
 * Server action pair naturally with HTML form tag --> <form></form>
 * Next.js serializes that form data and then posts it for us.
 * We this this better than writing fetch API POST method by hand, (It's better approach)
 */
'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import {
  MAX_INFANTS,
  MIN_ADULTS,
  PROCESSING_FEE_RATE,
} from '@/lib/booking-rules';

/**
 * Schema
 */
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});
const reservationSchema = z.object({
  listingId: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-zA-Z0-9_-]+$/),
  startDate: z.string(),
  endDate: z.string(),
  adults: z.coerce.number().int().min(MIN_ADULTS),
  children: z.coerce.number().int().min(0),
  infants: z.coerce.number().int().min(0).max(MAX_INFANTS),
});
const listingSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  imageSrc: z.string().url(),
  imageGallery: z.array(z.string().url()).min(1).max(10),
  category: z.string().min(2),
  roomCount: z.coerce.number().int().min(1),
  bathroomCount: z.coerce.number().int().min(1),
  guestCount: z.coerce.number().int().min(1),
  locationValue: z.string().min(2),
  pricePerNight: z.coerce.number().int().min(10),
});

/**
 * Helpers
 */
function redirectWithBookingError(listingId: string, message: string): never {
  redirect(
    `/listings/${listingId}?booking-error&message=${encodeURIComponent(message)}`,
  );
}

/**
 * Functions
 */
export async function registerUser(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If registration did fail or if it is not valid.
  if (!parsed.success) throw new Error('Invalid registration input.');

  // Prevent duplicate emails.
  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) throw new Error('Email already exists.');

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      hashedPassword,
    },
  });

  redirect('/login');
}

export async function createReservation(formData: FormData) {
  const user = await requireUser();
  const fallbackListingId = String(formData.get('listingId') ?? '');
  const parsed = reservationSchema.safeParse({
    listingId: formData.get('listingId'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    adults: formData.get('adults'),
    children: formData.get('children'),
    infants: formData.get('infants'),
  });

  if (!parsed.success) {
    if (fallbackListingId) {
      redirectWithBookingError(
        fallbackListingId,
        'Please review your reservation details and try again.',
      );
    }
    redirect(
      '/bookings?message=Please review your reservation details and try again.',
    );
  }

  const startDate = new Date(parsed.data!.startDate);
  const endDate = new Date(parsed.data!.endDate);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    redirectWithBookingError(
      parsed.data!.listingId,
      'Please select valid check-in and checkout dates.',
    );
  }
  if (endDate <= startDate) {
    redirectWithBookingError(
      parsed.data!.listingId,
      'Checkout must be after check-in.',
    );
  }

  const listing = await prisma.listing.findUnique({
    where: { id: parsed.data?.listingId },
  });

  if (!listing) {
    redirectWithBookingError(parsed.data!.listingId, 'Listing not found');
  }

  const totalGuests =
    parsed.data!.adults + parsed.data!.children + parsed.data!.infants;
  if (totalGuests > listing!.guestCount) {
    redirectWithBookingError(
      listing!.id,
      `This listing allows up to ${listing?.guestCount} guests. Please adjust your guest count.`,
    );
  }

  /**
   * Double booking check / no overlapping
   */
  const overlappingReservation = await prisma.reservation.findFirst({
    where: {
      listingId: listing!.id,
      startDate: { lt: endDate },
      endDate: { gt: startDate },
    },
  });
  if (overlappingReservation) {
    redirectWithBookingError(
      listing!.id,
      'Selected with dates are already booked. Please choose different dates.',
    );
  }

  const nights = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const subtotal = nights * listing!.pricePerNight;
  const processingFee = Math.round(subtotal * PROCESSING_FEE_RATE);
  const totalPrice = subtotal + processingFee;
  await prisma.reservation.create({
    data: {
      userId: user.id,
      listingId: listing!.id,
      startDate,
      endDate,
      totalPrice,
    },
  });

  revalidatePath('/bookings');
  revalidatePath(`/listings/${listing!.id}`);
  revalidatePath('/host');
  redirect(`/listings/${listing!.id}?booking=success`);
}

export async function cancelReservation(formData: FormData) {
  const user = await requireUser();
  const reservationId = String(formData.get('reservationId') ?? '');
  if (!reservationId) throw new Error('Reservation id is missing');

  const reservation = await prisma.reservation.findFirst({
    where: {
      id: reservationId,
      userId: user.id,
    },
  });

  if (!reservation) {
    redirect('/bookings?message=Reservation not found');
  }

  await prisma.reservation.delete({
    where: { id: reservation.id },
  });

  revalidatePath('/bookings');
  revalidatePath(`/listings/${reservation.listingId}`);
  revalidatePath('/host');
  redirect('/bookings?message=Reservation cancelled successfully.');
}

function parseListingGallery(rawGallery: FormDataEntryValue | null) {
  try {
    const value = JSON.parse(String(rawGallery ?? '[]'));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export async function createListing(formData: FormData) {
  const user = await requireUser();
  const parsedGallery = parseListingGallery(formData.get('imageGallery'));
  const parsed = listingSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    imageSrc: formData.get('imageSrc'),
    imageGallery: parsedGallery,
    category: formData.get('category'),
    roomCount: formData.get('roomCount'),
    bathroomCount: formData.get('bathroomCount'),
    guestCount: formData.get('guestCount'),
    locationValue: formData.get('locationValue'),
    pricePerNight: formData.get('pricePerNight'),
  });
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map(({ path, message }) => `${path.join('.')}: ${message}`)
      .join('; ');
    throw new Error(`Invalid listing payload: ${issues}`);
  }
  await prisma.listing.create({
    data: {
      ...parsed.data,
      userId: user.id,
    },
  });
  revalidatePath('/');
  revalidatePath('/host');
}

export async function deleteListing(formData: FormData) {
  const user = await requireUser();
  const listingId = String(formData.get('listingId') ?? '');
  if (!listingId) throw new Error('Listing id is missing');

  await prisma.listing.deleteMany({
    where: {
      id: listingId,
      userId: user.id,
    },
  });

  revalidatePath('/');
  revalidatePath('/host');
}

export async function updateListing(listingId: string, formData: FormData) {
  const user = await requireUser();
  if (!listingId) throw new Error('Listing id is missing');

  const parsedGallery = parseListingGallery(formData.get('imageGallery'));
  const parsed = listingSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    imageSrc: formData.get('imageSrc'),
    imageGallery: parsedGallery,
    category: formData.get('category'),
    roomCount: formData.get('roomCount'),
    bathroomCount: formData.get('bathroomCount'),
    guestCount: formData.get('guestCount'),
    locationValue: formData.get('locationValue'),
    pricePerNight: formData.get('pricePerNight'),
  });

  if (!parsed.success) throw new Error('Invalid listing payload');

  const updated = await prisma.listing.updateMany({
    where: {
      id: listingId,
      userId: user.id,
    },
    data: parsed.data,
  });

  if (updated.count === 0) {
    throw new Error('Listing not found or access denied');
  }

  revalidatePath('/');
  revalidatePath('/host');
  revalidatePath(`/listings/${listingId}`);
  redirect('/host');
}
