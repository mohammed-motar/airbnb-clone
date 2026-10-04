import { ListingImageGallery } from '@/components/listing/listing-image-gallery';
import { getCurrentUser } from '@/lib/auth';
import { fetchDemoProperties } from '@/lib/demo-properties';
import { prisma } from '@/lib/prisma';
import { syncDemoListingById } from '@/lib/sync-demo-listings';
import { notFound } from 'next/navigation';

type ListingPageProps = {
  params: Promise<{
    listingId: string;
  }>;
  searchParams: Promise<{
    booking?: string;
    message?: string;
    checkIn?: string;
    checkOut?: string;
    adults?: string;
    children?: string;
    infants?: string;
  }>;
};

export default async function ListingPage({
  params,
  searchParams,
}: ListingPageProps) {
  const { listingId } = await params;
  const query = await searchParams;
  const demoProperties = await fetchDemoProperties();
  const demoListingSeed = demoProperties.find(
    (property) => property.id === listingId,
  );
  let dbListing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { user: true },
  });

  const user = await getCurrentUser();
  const isDemoListing = Boolean(
    demoListingSeed && dbListing?.category === 'Demo Stay',
  );
  const demoListing = demoListingSeed;
  const hostRating = demoListing?.rating ?? 4.9;

  if (!dbListing && !demoListing) notFound();
  if (demoListing && !dbListing) notFound();

  const listing = dbListing
    ? {
        id: dbListing.id,
        title: dbListing.title,
        description: dbListing.description,
        locationValue: dbListing.locationValue,
        imageGallery: dbListing.imageGallery,
        pricePerNight: dbListing.pricePerNight,
        category: dbListing.category,
        guestCount: dbListing.guestCount,
        roomCount: dbListing.roomCount,
        bathroomCount: dbListing.bathroomCount,
        hostName: dbListing.user?.name ?? 'Verified host',
      }
    : {
        id: demoListing!.id,
        title: demoListing!.title,
        description: `A curated demo stay in ${demoListing!.city} with a modern setup ideal for short trips and log weekends.`,
        locationValue: demoListing!.city,
        imageSrc: demoListing!.image,
        imageGallery: [demoListing!.image],
        pricePerNight: [demoListing!.pricePerNight],
        category: 'Demo Stay',
        guestCount: demoListing!.maxGuests,
        roomCount: Math.max(1, Math.round(demoListing!.maxGuests / 2)),
        bathroomCount: Math.max(1, Math.round(demoListing!.maxGuests / 3)),
        hostName: demoListing!.hostName,
      };

  return (
    <main className='mx-auto min-h-screen max-w-7xl px-4 pb-28 pt-5 md:px-8 md:pb-10 md:pt-8'>
      <article className='space-y-6 md:space-y-8'>
        <div className='grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:items-start'>
          <div className='order-2 space-y-6 md:space-y-7 lg:order-1'>
            <section>
              <ListingImageGallery
                images={
                  listing.imageGallery.length > 0
                    ? listing.imageGallery
                    : [listing.imageSrc]
                }
                altBase={listing.title}
              />
              <p>ListingImageGallery</p>
              {/* <ListingHeaderInfo /> */}
              <p>ListingHeaderInfo</p>
            </section>
            {/* <ListingAbout /> */}
            <p>ListingAbout</p>
            {/* <ListingBookedRanges /> */}
            <p>ListingBookedRanges</p>
            {/* <ListingMap /> */}
            <p>ListingMap</p>
          </div>

          <div className='order-1 lg:order-2'>
            {/* <ListingBookingSidebar /> */}
            ListingBookingSidebar
          </div>
        </div>
      </article>
    </main>
  );
}
