import type { DemoProperty } from '@/types/demo-property';
import { addDays, format, startOfDay, startOfToday } from 'date-fns';

function buildAvailabilityDates(
  openDays: number,
  blockedRanges: Array<{ startOffset: number; endOffset: number }>,
) {
  const today = startOfToday();
  const blocked = new Set<string>();

  for (const range of blockedRanges) {
    for (
      let offset = range.startOffset;
      offset <= range.endOffset;
      offset += 1
    ) {
      blocked.add(format(addDays(today, offset), 'yyyy-MM-dd'));
    }
  }

  return Array.from({ length: openDays }, (_, index) =>
    format(addDays(today, index), 'yyyy-MM-dd'),
  ).filter((date) => !blocked.has(date));
}

export const US_LISTINGS_SEED: DemoProperty[] = [
  {
    id: 'ny-1',
    title: 'Central New York Designer Stay',
    image: '/images/listings/ny-1-v3.jpg',
    city: 'New York, United States',
    pricePerNight: 320,
    hostName: 'Host Aiden',
    rating: 4.9,
    maxGuests: 8,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 10, endOffset: 13 },
      { startOffset: 42, endOffset: 47 },
    ]),
  },
  {
    id: 'ny-2',
    title: 'Soho Loft with City Views',
    image: '/images/listings/ny-2-v3.jpg',
    city: 'New York, United States',
    pricePerNight: 280,
    hostName: 'Host Maya',
    rating: 4.8,
    maxGuests: 6,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 18, endOffset: 21 },
      { startOffset: 70, endOffset: 75 },
    ]),
  },
  {
    id: 'ny-3',
    title: 'Brooklyn Brownstone Apartment',
    image: '/images/listings/ny-3-v3.jpg',
    city: 'New York, United States',
    pricePerNight: 255,
    hostName: 'Host Ezra',
    rating: 4.7,
    maxGuests: 5,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 6, endOffset: 8 },
      { startOffset: 54, endOffset: 59 },
    ]),
  },
  {
    id: 'ny-4',
    title: 'Hudson River Modern Suite',
    image: '/images/listings/ny-4-v3.jpg',
    city: 'New York, United States',
    pricePerNight: 310,
    hostName: 'Host Liam',
    rating: 4.9,
    maxGuests: 7,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 24, endOffset: 27 },
      { startOffset: 88, endOffset: 92 },
    ]),
  },
  {
    id: 'la-1',
    title: 'Los Angeles Hillside Home',
    image: '/images/listings/la-1-v3.jpg',
    city: 'Los Angeles, United States',
    pricePerNight: 295,
    hostName: 'Host Olivia',
    rating: 4.8,
    maxGuests: 8,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 9, endOffset: 12 },
      { startOffset: 61, endOffset: 66 },
    ]),
  },
  {
    id: 'la-2',
    title: 'Venice Beach Airy Apartment',
    image: '/images/listings/la-2-v3.jpg',
    city: 'Los Angeles, United States',
    pricePerNight: 265,
    hostName: 'Host Noah',
    rating: 4.7,
    maxGuests: 6,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 31, endOffset: 35 },
      { startOffset: 90, endOffset: 94 },
    ]),
  },
  {
    id: 'la-3',
    title: 'Hollywood Studio Retreat',
    image: '/images/listings/la-3-v3.jpg',
    city: 'Los Angeles, United States',
    pricePerNight: 230,
    hostName: 'Host Aria',
    rating: 4.8,
    maxGuests: 4,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 14, endOffset: 16 },
      { startOffset: 77, endOffset: 80 },
    ]),
  },
  {
    id: 'la-4',
    title: 'Santa Monica Sunset Condo',
    image: '/images/listings/la-4-v3.jpg',
    city: 'Los Angeles, United States',
    pricePerNight: 340,
    hostName: 'Host Mason',
    rating: 4.9,
    maxGuests: 7,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 43, endOffset: 46 },
      { startOffset: 103, endOffset: 108 },
    ]),
  },
  {
    id: 'mi-1',
    title: 'Miami Waterfront Condo',
    image: '/images/listings/mi-1-v3.jpg',
    city: 'Miami, United States',
    pricePerNight: 275,
    hostName: 'Host Sofia',
    rating: 4.8,
    maxGuests: 6,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 20, endOffset: 24 },
      { startOffset: 82, endOffset: 86 },
    ]),
  },
  {
    id: 'mi-2',
    title: 'South Beach Chic Studio',
    image: '/images/listings/mi-2-v4.jpg',
    city: 'Miami, United States',
    pricePerNight: 245,
    hostName: 'Host Ethan',
    rating: 4.7,
    maxGuests: 4,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 5, endOffset: 7 },
      { startOffset: 49, endOffset: 52 },
    ]),
  },
  {
    id: 'mi-3',
    title: 'Brickell Skyline Stay',
    image: '/images/listings/mi-3-v4.jpg',
    city: 'Miami, United States',
    pricePerNight: 285,
    hostName: 'Host Emma',
    rating: 4.8,
    maxGuests: 5,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 28, endOffset: 32 },
      { startOffset: 99, endOffset: 102 },
    ]),
  },
  {
    id: 'mi-4',
    title: 'Coral Gables Family Flat',
    image: '/images/listings/mi-4-v3.jpg',
    city: 'Miami, United States',
    pricePerNight: 260,
    hostName: 'Host Lucas',
    rating: 4.7,
    maxGuests: 7,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 12, endOffset: 15 },
      { startOffset: 73, endOffset: 78 },
    ]),
  },
  {
    id: 'ch-1',
    title: 'Chicago Riverfront Loft',
    image: '/images/listings/ch-1-v3.jpg',
    city: 'Chicago, United States',
    pricePerNight: 235,
    hostName: 'Host Ava',
    rating: 4.8,
    maxGuests: 5,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 17, endOffset: 19 },
      { startOffset: 57, endOffset: 63 },
    ]),
  },
  {
    id: 'ch-2',
    title: 'West Loop Designer Condo',
    image: '/images/listings/ch-2-v3.jpg',
    city: 'Chicago, United States',
    pricePerNight: 225,
    hostName: 'Host Leo',
    rating: 4.7,
    maxGuests: 4,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 35, endOffset: 39 },
      { startOffset: 84, endOffset: 88 },
    ]),
  },
  {
    id: 'ch-3',
    title: 'Lincoln Park Bright Suite',
    image: '/images/listings/ch-3-v3.jpg',
    city: 'Chicago, United States',
    pricePerNight: 210,
    hostName: 'Host Mila',
    rating: 4.8,
    maxGuests: 6,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 8, endOffset: 10 },
      { startOffset: 64, endOffset: 69 },
    ]),
  },
  {
    id: 'ch-4',
    title: 'Lake Shore Modern Home',
    image: '/images/listings/ch-4-v3.jpg',
    city: 'Chicago, United States',
    pricePerNight: 255,
    hostName: 'Host Jack',
    rating: 4.9,
    maxGuests: 8,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 26, endOffset: 30 },
      { startOffset: 108, endOffset: 112 },
    ]),
  },
  {
    id: 'sf-1',
    title: 'San Francisco Bay View Apartment',
    image: '/images/listings/sf-1-v3.jpg',
    city: 'San Francisco, United States',
    pricePerNight: 345,
    hostName: 'Host Chloe',
    rating: 4.8,
    maxGuests: 5,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 11, endOffset: 14 },
      { startOffset: 68, endOffset: 72 },
    ]),
  },
  {
    id: 'sf-2',
    title: 'Mission District Urban Flat',
    image: '/images/listings/sf-2-v4.jpg',
    city: 'San Francisco, United States',
    pricePerNight: 310,
    hostName: 'Host Owen',
    rating: 4.7,
    maxGuests: 4,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 22, endOffset: 25 },
      { startOffset: 93, endOffset: 96 },
    ]),
  },
  {
    id: 'sf-3',
    title: 'Golden Gate Cozy Retreat',
    image: '/images/listings/sf-3-v4.jpg',
    city: 'San Francisco, United States',
    pricePerNight: 330,
    hostName: 'Host Nora',
    rating: 4.8,
    maxGuests: 6,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 38, endOffset: 42 },
      { startOffset: 116, endOffset: 120 },
    ]),
  },
  {
    id: 'sf-4',
    title: 'Noe Valley Family Home',
    image: '/images/listings/sf-4-v3.jpg',
    city: 'San Francisco, United States',
    pricePerNight: 360,
    hostName: 'Host Henry',
    rating: 4.9,
    maxGuests: 7,
    availableDates: buildAvailabilityDates(180, [
      { startOffset: 15, endOffset: 18 },
      { startOffset: 79, endOffset: 83 },
    ]),
  },
];
