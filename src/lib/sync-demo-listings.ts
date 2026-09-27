import { prisma } from '@/lib/prisma';
import { fetchDemoProperties, type DemoProperty } from './demo-properties';
/**
 * This file is for:
 * Building a consistent marketing blurb for demo stays in a given city
 */

function demoListingDescription(city: string) {
  return `A curated demo stay in ${city} with a modern setup ideal for short trips and long weekends.`;
}

function demoHostEmail(property: DemoProperty) {
  return `demo-host-${property.id}@stayscape.com`;
}

/**
 * Ensure that a user row exists for DemoProperty host name.
 * Creates on first user sync and that updates you the display name if the demo API changes it.
 * @param property
 * @returns
 */
async function ensureDemoHostUser(property: DemoProperty) {
  return prisma.user.upsert({
    where: { email: demoHostEmail(property) },
    create: {
      email: demoHostEmail(property),
      name: property.hostName,
    },
    update: {
      name: property.hostName,
    },
    select: { id: true },
  });
}

/**
 * Create or update one listing row from the DemoProperty.
 * @param hostId
 * @param property
 */
async function upsertDemoListingRow(hostId: string, property: DemoProperty) {
  const roomCount = Math.max(1, Math.round(property.maxGuests / 2));
  const bathroomCount = Math.max(1, Math.round(property.maxGuests / 3));

  await prisma.listing.upsert({
    where: { id: property.id },
    create: {
      id: property.id,
      title: property.title,
      description: demoListingDescription(property.city),
      imageSrc: property.image,
      imageGallery: [property.image],
      category: 'Demo Stay',
      roomCount,
      bathroomCount,
      guestCount: property.maxGuests,
      locationValue: property.city,
      pricePerNight: property.pricePerNight,
      userId: hostId,
    },
    update: {
      title: property.title,
      description: demoListingDescription(property.city),
      imageSrc: property.image,
      imageGallery: [property.image],
      category: 'Demo Stay',
      roomCount,
      bathroomCount,
      guestCount: property.maxGuests,
      locationValue: property.city,
      pricePerNight: property.pricePerNight,
      userId: hostId,
    },
  });
}

/**
 * Upsert one demo listing by ID to the database.
 * @param listingId
 * @returns
 */
export async function syncDemoListingById(listingId: string) {
  const demoProperties = await fetchDemoProperties();
  const property = demoProperties.find((item) => item.id === listingId);

  if (!property) return;

  const host = await ensureDemoHostUser(property);
  await upsertDemoListingRow(host.id, property);
}

/**
 * Upsert every created demo listing into the Postgress.
 */
export async function syncDemoListingsToDatabase() {
  const demoProperties = await fetchDemoProperties();

  for (const property of demoProperties) {
    const host = await ensureDemoHostUser(property);
    await upsertDemoListingRow(host.id, property);
  }
}
