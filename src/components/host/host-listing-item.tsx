import Link from 'next/link';
import { BedDouble, Bath, Users, MapPin, Pencil, Trash2 } from 'lucide-react';
import { SafeImage } from '@/components/safe-image';
import { deleteListing } from '@/app/actions';

type HostListingItemProps = {
  listing: {
    id: string;
    title: string;
    description: string;
    locationValue: string;
    imageSrc: string;
    pricePerNight: number;
    category: string;
    guestCount: number;
    roomCount: number;
    bathroomCount: number;
  };
  index: number;
};

export function HostListingItem({ listing, index }: HostListingItemProps) {
  return (
    <article
      className='host-listing-card rounded-3xl border border-ink-200 bg-surface p-4 shadow-sm transition hover:shadow-md md:p-5'
      style={{ animationDelay: `${Math.min(index * 70 * 420)}ms` }}
    >
      <div className='grid grid-cols-[160px_1fr] gap-4 md:grid-cols-[220px_1fr] md:gap-5'>
        <Link
          href={`/listings/${listing.id}`}
          className='overflow-hidden rounded-2xl border border-ink-200'
        >
          <SafeImage
            src={listing.imageSrc}
            alt={listing.title}
            width={640}
            height={420}
            className='h-full min-h-44 w-full object-cover'
          />
        </Link>
        <Link href={`/listings/${listing.id}`} className='min-w-0'>
          <p className='inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700'>
            {listing.category}
          </p>
          <h3 className='mt-2 text-lg font-semibold leading-tight text-ink-900'>
            {listing.title}
          </h3>
          <p className='mt-2 inline-flex items-center gap-1.5 text-[0.8rem] text-ink-600 md:text-[0.9rem]'>
            <MapPin className='h-4 w-4' />
            {listing.locationValue}
          </p>
          <div className='mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-ink-600'>
            <span className='inline-flex items-center gap-1.5'>
              <Users className='h-3.5 w-3.5 text-ink-500' />
              {listing.guestCount}
            </span>

            <span className='h-1 w-1 rounded-full bg-ink-300' aria-hidden />

            <span className='inline-flex items-center gap-1.5'>
              <BedDouble className='h-3.5 w-3.5 text-ink-500' />
              {listing.roomCount}
            </span>

            <span className='h-1 w-1 rounded-full bg-ink-300' aria-hidden />

            <span className='inline-flex items-center gap-1.5'>
              <Bath className='h-3.5 w-3.5 text-ink-500' />
              {listing.bathroomCount}
            </span>
          </div>
        </Link>
        <p className='line-clamp-2 text-sm leading-relaxed text-ink-600 md:col-span-2'>
          {listing.description}
        </p>
      </div>

      <div className='flex items-end justify-between border-t border-ink-200 pt-3 md:col-span-2'>
        <div className='flex items-center gap-2'>
          <Link
            href={`/host/listings/${listing.id}/edit`}
            className='inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-100'
          >
            <Pencil className='h-4 w-4' />
            Edit
          </Link>

          <form action={deleteListing}>
            <input type='hidden' name='listingId' value={listing.id} />
            <button
              type='submit'
              className='inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-50'
            >
              <Trash2 className='h-4 w-4' />
              Delete
            </button>
          </form>
        </div>

        <p className='text-lg font-semibold text-ink-900'>
          ${listing.pricePerNight}
          <span className='ml-1 text-sm font-medium text-ink-600'>/ night</span>
        </p>
      </div>
    </article>
  );
}
