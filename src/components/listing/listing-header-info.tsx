import { MapPin, Star } from 'lucide-react';

type ListingHeaderInfoProp = {
  category: string;
  title: string;
  locationValue: string;
  hostRating: number;
  hostName: string;
  pricePerNight: string;
  listingStatusLabel: string;
};

export function ListingHeaderInfo({
  category,
  title,
  locationValue,
  hostRating,
  hostName,
  pricePerNight,
  listingStatusLabel,
}: ListingHeaderInfoProp) {
  return (
    <div className='space-y-4 p-5 md:p-6'>
      <div className='flex flex-wrap md:flex-nowrap items-center justify-between gap-3'>
        <div className='space-y-2'>
          {/* Category badge */}
          <p className='inline-flex rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700'>
            {category}
          </p>
          <h1 className='text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl lg:text-4xl'>
            {title}
          </h1>
          <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-600 md:text-sm'>
            <span className='inline-flex items-center gap-1.5'>
              <MapPin className='h-4 w-4' />
              {locationValue}
            </span>
            <span className='inline-flex items-center gap-1.5'>
              <Star className='h-4 w-4 fill-current text-ink-700' />
              {hostRating.toFixed(1)} host rating
            </span>
            <span>{listingStatusLabel}</span>
          </div>
        </div>

        <div className='hidden rounded-2xl border border-ink-200 bg-surface-muted px-4 py-3 text-right text-sm font-medium text-ink-900 md:block'>
          <p>
            {pricePerNight}
            <span className='ml-1 text-xs font-normal text-ink-600'>
              {' '}
              / night
            </span>
          </p>
          <p className='mt-1 text-xs text-ink-500'>Hosted by ${hostName}</p>
        </div>
      </div>
    </div>
  );
}
