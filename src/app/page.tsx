import Link from 'next/link';
import { format } from 'date-fns';
import {
  ChevronRight,
  Flame,
  HomeIcon,
  Landmark,
  Mountain,
  Palmtree,
  Snowflake,
  Star,
  TreePalm,
  Users,
  Waves,
} from 'lucide-react';
import { fetchDemoProperties } from '@/lib/demo-properties';
import { availableMemory } from 'process';
import { SafeImage } from '@/components/safe-image';
import { HomeSearchBar } from '@/components/home-search-bar';

type HomePageProps = {
  searchParams: Promise<{
    location?: string;
    category?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    adults?: string;
    children?: string;
    infants?: string;
  }>;
};

type UnifiedCard = {
  id: string;
  title: string;
  image: string;
  city: string;
  category: string;
  hostName: string;
  rating: number;
  price: number;
  maxGuests: number;
  availableDates: string[];
  isExternal: boolean;
};

function groupByCity(cards: UnifiedCard[]) {
  const grouped = new Map<string, UnifiedCard[]>();
  for (const card of cards) {
    const list = grouped.get(card.city) ?? [];
    list.push(card);
    grouped.set(card.city, list);
  }
  return Array.from(grouped.entries()).map(([city, items]) => ({
    city,
    items,
  }));
}

const categoryItems = [
  { label: 'Scenic views', icon: Mountain },
  { label: 'Beachfront', icon: Palmtree },
  { label: 'Guest favorites', icon: Flame },
  { label: 'Cabins', icon: HomeIcon },
  { label: 'Countryside stays', icon: TreePalm },
  { label: 'Lakefront', icon: Waves },
  { label: 'Historic homes', icon: Landmark },
  { label: 'Ski-in/out', icon: Snowflake },
];

function normalizeUsCity(location: string) {
  const lower = location.toLowerCase();
  if (lower.includes('new york')) return 'New York, United States';
  if (lower.includes('los angeles')) return 'Los Angeles, United States';
  if (lower.includes('miami')) return 'Miami, United States';
  if (lower.includes('chicago')) return 'Chicago, United States';
  if (lower.includes('san francisco')) return 'San Francisco, United States';
  if (lower.includes('seattle')) return 'Seattle, United States';
  if (lower.includes('boston')) return 'Boston, United States';
  return 'United States';
}

function buildDateRangeInclusive(start: Date, end: Date) {
  const dates: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function isRangeAvailable(
  availableDates: string[], // means an array of strings.
  checkIn?: string,
  checkOut?: string,
) {
  if (!checkIn || !checkOut) return true;

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime) ||
    end < start
  ) {
    return true;
  }

  const requested = buildDateRangeInclusive(start, end);
  if (availableDates.length === 0) return true;

  const mdSet = new Set(
    availableDates
      .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
      .map((d) => d.slice(5)),
  );

  return requested.every((d) => mdSet.has(d.slice(5)));
}

function formatDateRange(checkIn?: string, checkOut?: string) {
  if (!checkIn || !checkOut) return 'Anytime';
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'Anytime';
  }
  return `${format(start, 'MMM d')}-${format(end, 'MMM d')}`;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  // We are doing listingQueryParams to use the amount of guests and
  // prefill it on listing page so we don't need to choose the guest again.
  const listingQueryParams = new URLSearchParams();
  if (params.location) listingQueryParams.set('location', params.location);
  if (params.checkIn) listingQueryParams.set('checkIn', params.checkIn);
  if (params.checkOut) listingQueryParams.set('checkOut', params.checkOut);
  if (params.guests) listingQueryParams.set('guests', params.guests);
  if (params.adults) listingQueryParams.set('adults', params.adults);
  if (params.children) listingQueryParams.set('children', params.children);
  if (params.infants) listingQueryParams.set('infants', params.infants);
  const listingQuery = listingQueryParams.toString();

  const buildListingHref = (listingId: string) =>
    `/listings/${listingId}${listingQuery ? `?${listingQuery}` : ''}`;

  const hasAnyFilter = Boolean(params.category?.trim());
  const hasLocationSearch = Boolean(params.location?.trim());

  const demoProperties = await fetchDemoProperties();
  const allCards: UnifiedCard[] = [
    ...demoProperties.map((property, index) => ({
      id: property.id,
      title: property.title,
      image: property.image,
      city: normalizeUsCity(property.city),
      category:
        categoryItems[index % categoryItems.length]?.label ?? 'Trending',
      hostName: property.hostName,
      rating: property.rating,
      price: property.pricePerNight,
      maxGuests: property.maxGuests,
      availableDates: property.availableDates,
      isExternal: true,
    })),
  ];

  const requestedGuests =
    Number(params.adults ?? 0) +
      Number(params.children ?? 0) +
      Number(params.infants ?? 0) ||
    Number(params.guests) ||
    1;

  const unifiedCards = allCards.filter((card) => {
    const byLocation = params.location
      ? card.city.toLowerCase().includes(params.location.toLowerCase())
      : true;
    const byCategory = params.category
      ? card.category.toLowerCase() === params.category.toLowerCase()
      : true;
    const byGuests = card.maxGuests >= requestedGuests;
    return byLocation && byCategory && byGuests;
  });

  const adults = Number(params.adults ?? 0) || 0;
  const children = Number(params.children ?? 0) || 0;
  const infants = Number(params.infants ?? 0) || 0;
  const locationLabel = params.location?.trim() || 'Anywhere';
  const dateLabel = formatDateRange(params.checkIn, params.checkOut);
  const guestParts: string[] = [];
  if (adults > 0) {
    guestParts.push(`${adults} adult${adults > 1 ? 's' : ''}`);
  }
  if (children > 0) {
    guestParts.push(`${children} child${children > 1 ? 'ren' : ''}`);
  }
  if (infants > 0) {
    guestParts.push(`${infants} Infant${infants > 1 ? 's' : ''}`);
  }
  const guestsLabel =
    guestParts.length > 0
      ? guestParts.join(', ')
      : `${requestedGuests} guest${requestedGuests > 1 ? 's' : ''}`;

  const limitedCards = unifiedCards.slice(0, 20);
  const groupedCards = groupByCity(limitedCards);
  const defaultGridCards = limitedCards;

  return (
    <main className='mx-auto min-h-screen max-w-7xl px-4 pb-14 pt-8 md:px-8 md:pb-12 md:pt-6'>
      <section className='rounded-3xl border border-ink-200 bg-gradient-to-br from-brand-50 via-surface to-ink-50 p-6 md:p-10'>
        <div className='mx-auto max-w-[50.5rem] text-center'>
          <p className='text-sm font-semibold uppercase tracking-[0.2em] text-brand-600'>
            Thoughtfully selected homes across the United States
          </p>
          <h1 className='mt-5 text-3xl font-bold tracking-tight text-ink-900 md:mt-3 md:text-5xl'>
            Find the right place to stay
          </h1>
          <p className='mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-600 md:mt-3 md:text-base'>
            Explore professionally presented stays in leading US destinations.
            Filter by location, dates, and guest count to shortlist the best fit
            for your trip.
          </p>
        </div>

        <div className='mx-auto mt-7 max-w-[57.5rem] md:mt-8'>
          <HomeSearchBar
            initialLocation={params.location}
            initialGuests={params.guests}
            initialAdults={params.adults}
            initialChildren={params.children}
            initialInfants={params.infants}
            initialCheckIn={params.checkIn}
            initialCheckOut={params.checkOut}
          />
        </div>
        <div className='mx-auto mt-6 flex max-w-[57.5rem] items-start justify-between gap-3'>
          <div className='hide-scrollbar flex gap-2 overflow-x-auto whitespace-nowrap pb-1'>
            {categoryItems.map((item) => {
              const Icon = item.icon;
              const isActive = params.category === item.label;
              return (
                <Link
                  href={`/?category=${encodeURIComponent(item.label)}${params.location ? `&location=${encodeURIComponent(params.location)}` : ''}${params.guests ? `&guests=${encodeURIComponent(params.guests)}` : ''}${params.adults ? `&adults=${encodeURIComponent(params.adults)}` : ''}${params.children ? `&children=${encodeURIComponent(params.children)}` : ''}${params.infants ? `&infants=${encodeURIComponent(params.infants)}` : ''}${params.checkIn ? `&checkIn=${encodeURIComponent(params.checkIn)}` : ''}${params.checkOut ? `&checkOut=${encodeURIComponent(params.checkOut)}` : ''}`}
                  key={item.label}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${isActive ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-300 text-ink-700 hover:bg-ink-100'}`}
                >
                  <Icon className='h-4 w-4' />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {hasAnyFilter ? (
            <Link
              href='/'
              className='inline-flex shrink-0 items-center gap-2 rounded-full border border-ink-300 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100'
            >
              Clear filters
            </Link>
          ) : null}
        </div>

        <p className='mx-auto mt-3 max-w-[57.5rem] text-sm text-ink-600'>
          Showing stays for{' '}
          <span className='font-medium text-ink-900'>{guestsLabel}</span>
          {' . '}
          <span className='font-medium text-ink-900'>{dateLabel}</span>
          {' . '}
          <span className='font-medium text-ink-900'>{locationLabel}</span>
        </p>
      </section>

      {unifiedCards.length === 0 ? (
        <section className='mt-10 md:mt-8'>
          <p className='text-ink-600'>
            No stays match your current filter. Try adjusting destination,
            dates, or guest count.
          </p>
        </section>
      ) : (
        <>
          {hasLocationSearch ? (
            <section className='mt-10 space-y-10 md:mt-8 md:space-y-9'>
              {groupedCards.map((group) => (
                <div key={group.city}>
                  <div className='mb-4 flex items-center gap-2'>
                    <h2 className='text-2xl font-semibold tracking-tight text-ink-900'>
                      Top stays in {group.city}
                    </h2>
                    <ChevronRight className='h-5 w-5 text-ink-700' />
                  </div>

                  <div className='grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 md:gap-4 lg:grid-cols-4'>
                    {group.items.slice(0, 16).map((item, index) => (
                      <Link
                        href={buildListingHref(item.id)}
                        className='block space-y-2'
                        key={item.id}
                      >
                        <div className='overflow-hidden rounded-2xl'>
                          <SafeImage
                            src={item.image}
                            alt={item.title}
                            width={420}
                            height={280}
                            className='h-48 w-full object-cover'
                            priority={index < 4}
                          />
                        </div>
                        <div className='space-y-0.5 px-0.5'>
                          <p className='inline-flex rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-medium text-ink-700'>
                            {item.city}
                          </p>
                          <p className='line-clamp-1 text-sm font-medium text-ink-900'>
                            {item.title}
                          </p>
                          <p className='line-clamp-1 text-xs text-ink-500'>
                            ${item.price} for 2 nights
                            <span className='ml-1 inline-flex items-center gap-0.5'>
                              <Star className='h-3 w-3 fill-current text-ink-700' />
                              {item.rating}
                            </span>
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ) : (
            <section className='mt-10 md:mt-8'>
              <div className='mb-4 flex items-center gap-2'>
                <h2 className='text-2xl font-semibold tracking-tight text-ink-900'>
                  Top picks across the United States
                </h2>
                <ChevronRight className='h-5 w-5 text-ink-700' />
              </div>

              <div className='grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 md:gap-4 lg:grid-cols-4'>
                {defaultGridCards.map((item, index) => (
                  <Link
                    href={buildListingHref(item.id)}
                    className='block space-y-2'
                    key={item.id}
                  >
                    <div className='overflow-hidden rounded-2xl'>
                      <SafeImage
                        src={item.image}
                        alt={item.title}
                        width={420}
                        height={280}
                        className='h-48 w-full object-cover'
                        priority={index < 4}
                      />
                    </div>
                    <div className='space-y-0.5 px-0.5'>
                      <p className='inline-flex rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-medium text-ink-700'>
                        {item.city}
                      </p>
                      <p className='line-clamp-1 text-sm font-medium text-ink-900'>
                        {item.title}
                      </p>
                      <p className='line-clamp-1 text-xs text-ink-500'>
                        ${item.price} for 2 nights
                        <span className='ml-1 inline-flex items-center gap-0.5'>
                          <Star className='h-3 w-3 fill-current text-ink-700' />
                          {item.rating}
                        </span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <footer className='mt-16 rounded-3xl border border-ink-200 bg-surface p-6 shadow-sm md:mt-14 md:p-7'>
        <div className='grid gap-8 md:grid-cols-4'>
          <div className='md:col-span-2'>
            <h3 className='text-2xl font-semibold text-ink-900'>
              Kaabi Travel
            </h3>
            <p className='mt-3 max-w-xl text-sm text-ink-600'>
              Discover carefully curated US stays with a booking flow designed
              for clarity and confidence. Compare homes quickly and reserve with
              ease.
            </p>
            <p className='mt-5 inline-flex items-center gap-1 text-xs text-ink-500'>
              <Users className='h-3.5 w-3.5' />
              Powered by curated sample listing data focused on US destinations
            </p>
          </div>

          <div>
            <h4 className='text-sm font-semibold text-ink-900'>Explore</h4>
            <ul className='mt-3 space-y-2 text-sm text-ink-600'>
              <li>City getaways</li>
              <li>Coastal retreats</li>
              <li>Cabin weekends</li>
              <li>Extended stays</li>
            </ul>
          </div>
          <div>
            <h4 className='text-sm font-semibold text-ink-900'>Support</h4>
            <ul className='mt-3 space-y-2 text-sm text-ink-600'>
              <li>Guest help center</li>
              <li>Host guidelines</li>
              <li>Cancellation policy</li>
              <li>Trust and safety</li>
            </ul>
          </div>
        </div>
        <div className='mt-8 border-t border-ink-200 pt-4 text-xs text-ink-500'>
          &copy; {new Date().getFullYear()} Kaabi Travel. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
