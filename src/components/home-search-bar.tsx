'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { type DateRange } from 'react-day-picker';
import { MAX_INFANTS } from '@/lib/booking-rules';
import { toValidate } from '@/lib/daa-utils';
import { DateRangePicker } from '@/components/date-range-picker';

type HomeSearchBarProps = {
  initialLocation?: string; // the "?" means optional
  initialGuests?: string;
  initialAdults?: string;
  initialChildren?: string;
  initialInfants?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
};

function SearchSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className='inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-70 md:w-auto'
      disabled={pending}
    >
      <Search className='h-4 w-4' />
      {pending ? 'Search...' : 'Search'}
    </button>
  );
}

export function HomeSearchBar({
  initialLocation,
  initialGuests,
  initialAdults,
  initialChildren,
  initialInfants,
  initialCheckIn,
  initialCheckOut,
}: HomeSearchBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState<
    'where' | 'when' | 'who' | null
  >(null);
  const [location, setLocation] = useState(initialLocation ?? '');
  const [adults, setAdults] = useState(
    Number(initialAdults || initialGuests || 1),
  );
  const [children, setChildren] = useState(Number(initialChildren || 0));
  const [infants, setInfants] = useState(Number(initialInfants || 0));
  const [range, setRange] = useState<DateRange | undefined>({
    from: toValidate(initialCheckIn),
    to: toValidate(initialCheckOut),
  });
  const [isDesktopViewPort, setIsDesktopViewPort] = useState(false);
  const totalGuests = adults + children + infants;

  const whenLabel = useMemo(() => {
    if (!range?.from && !range?.to) return 'Add dates';
    if (range?.from && !range?.to)
      return `${format(range.from, 'MMM d')} - Add`;
    if (range?.from && range?.to) {
      return `${format(range.from, 'MMM d')} - ${format(range.to, 'MMM d')}`;
    }
    return 'Add dates';
  }, [range]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const syncViewport = () => setIsDesktopViewPort(mediaQuery.matches);
    syncViewport();
    mediaQuery.addEventListener('change', syncViewport);

    return () => mediaQuery.removeEventListener('change', syncViewport);
  }, []);

  return (
    <div className='relative rounded-[32px] bg-surface p-2.5 shadow-sm md:border md:border-ink-200 md:p-4'>
      {/* activePanel */}
      {/* Full screen scrim behind panels on mobile. Click to dismiss */}
      {activePanel ? (
        <button
          className='fixed inset-0 z-10 bg-ink-900/20 backdrop-blur-[1px]'
          aria-label='Close panel'
          onClick={() => setActivePanel(null)}
        />
      ) : null}

      <form className='rounded-[28px] border border-ink-300 p-2.5 shadow-sm md:rounded-full md:p-1.5'>
        <div className='space-y-2 md:hidden'>
          <button
            type='button'
            className='w-full rounded-2xl border-ink-200 bg-surface px-4 py-2.5 text-left shadow-sm shadow-ink-900/5 transition hover:bg-ink-100 md:border-transparent md:bg-transparent md:shadow-none'
            onClick={() =>
              setActivePanel(activePanel === 'where' ? null : 'where')
            }
          >
            <span className='block text-xs font-semibold text-ink-900'>
              Where
            </span>
            <span className='block text-sm text-ink-600'>
              {location || 'Choose a destination'}
            </span>
          </button>

          <button
            type='button'
            className='w-full rounded-2xl border-ink-200 bg-surface px-4 py-2.5 text-left shadow-sm shadow-ink-900/5 transition hover:bg-ink-100 md:border-transparent md:bg-transparent md:shadow-none'
            onClick={() =>
              setActivePanel(activePanel === 'when' ? null : 'when')
            }
          >
            <span className='block text-xs font-semibold text-ink-900'>
              When
            </span>
            <span className='block text-sm text-ink-600'>{whenLabel}</span>
          </button>

          <button
            type='button'
            className='w-full rounded-2xl border-ink-200 bg-surface px-4 py-2.5 text-left shadow-sm shadow-ink-900/5 transition hover:bg-ink-100 md:border-transparent md:bg-transparent md:shadow-none'
            onClick={() => setActivePanel(activePanel === 'who' ? null : 'who')}
          >
            <span className='block text-xs font-semibold text-ink-900'>
              Who
            </span>
            <span className='block text-xs text-ink-600'>
              {totalGuests > 0
                ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}`
                : 'Add travelers'}
            </span>
          </button>
          <div className='pt-2'>
            <SearchSubmitButton />
          </div>
        </div>

        <div className='hidden gap-1 md:grid md:grid-cols-[1.5fr_1.5fr_1fr_auto]'>
          <button
            className='rounded-full border border-transparent px-4 py-2 text-left hover:bg-ink-100'
            onClick={() =>
              setActivePanel(activePanel === 'where' ? null : 'where')
            }
            type='button'
          >
            <span className='block text-xs font-semibold text-ink-900'>
              Where
            </span>
            <span className='block text-sm text-ink-600'>
              {location || 'Choose a destination'}
            </span>
          </button>
          <button
            className='rounded-full border border-transparent px-4 py-2 text-left hover:bg-ink-100'
            onClick={() =>
              setActivePanel(activePanel === 'when' ? null : 'when')
            }
            type='button'
          >
            <span className='block text-xs font-semibold text-ink-900'>
              When
            </span>
            <span className='block text-sm text-ink-600'>{whenLabel}</span>
          </button>
          <button
            type='button'
            className='rounded-full border border-transparent px-4 py-2 text-left hover:bg-ink-100'
            onClick={() => setActivePanel(activePanel === 'who' ? null : 'who')}
          >
            <span className='block text-xs font-semibold text-ink-900'>
              Who
            </span>
            <span className='block text-sm text-ink-600'>
              {totalGuests > 0
                ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}`
                : 'Add travelers'}
            </span>
          </button>
          <SearchSubmitButton />
        </div>

        {/* Synced to URL on submit. home page server reads searchParams */}
        <input type='hidden' name='location' value={location} />
        <input type='hidden' name='guests' value={totalGuests} />
        <input type='hidden' name='adults' value={adults} />
        <input type='hidden' name='children' value={children} />
        <input type='hidden' name='infants' value={infants} />
        <input
          type='hidden'
          name='checkIn'
          value={range?.from ? format(range.from, 'yyyy-MM-dd') : ''}
        />
        <input
          type='hidden'
          name='checkOut'
          value={range?.to ? format(range.to, 'yyyy-MM-dd') : ''}
        />
      </form>

      {activePanel === 'where' ? (
        <div className='fixed inset-0 z-20 flex items-center justify-center p-4 md:absolute md:inset-auto md:left-3 md:top-[88px] md:block md:w-[420px]'>
          <div className='w-full max-w-md rounded-3xl border border-ink-200 bg-surface p-4 shadow-xl md:max-w-none'>
            <p className='mb-2 text-sm font-semibold text-ink-900'>
              Popular destinations
            </p>
            {[
              'New York, United States',
              'Los Angeles, United States',
              'Miami, United States',
              'Chicago, United States',
              'San Francisco, United States',
            ].map((city) => (
              <button
                className='block w-full rounded-xl px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-100'
                key={city}
                type='button'
                onClick={() => {
                  setLocation(city);
                  setActivePanel(null);
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {activePanel === 'when' ? (
        <div
          className='fixed inset-0 z-20 flex items-center justify-center p-4 md:absolute md:inset-auto md:left-1/2 md:top-[88px] md:block md:w-[min(960px, calc(100vw-2rem))] md:-translate-x-1/2'
          onClick={() => setActivePanel(null)}
        >
          <div
            className='w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-auto rounded-[28px] border border-ink-200 bg-surface p-4 shadow-xl md:max-w-none md:max-h-none md:rounded-[32px] md:p-5'
            onClick={(event) => event.stopPropagation()}
          >
            <DateRangePicker
              selected={range}
              onSelect={setRange}
              numberOfMonths={isDesktopViewPort ? 2 : 1}
            />
            Day picker
          </div>
        </div>
      ) : null}

      {activePanel === 'who' ? (
        <div
          className='fixed inset-0 z-20 flex items-center justify-center p-4 md:absolute md:inset-auto md:right-3 md:top-[88px] md:block md:w-[360px]'
          onClick={() => setActivePanel(null)}
        >
          <div
            className='w-full max-w-md rounded-3xl border border-ink-200 bg-surface p-5 shadow-xl md:max-w-none'
            onClick={(event) => event.stopPropagation()}
          >
            {/* Adults */}
            <div className='flex items-center justify-between border-b border-ink-200 py-3'>
              <div>
                <p className='font-semibold text-ink-900'>Adults</p>
                <p className='text-sm text-ink-500'>Ages 13 or above</p>
              </div>
              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  className='h-8 w-8 rounded-full border border-ink-300 text-ink-700'
                  onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <span className='w-5 text-center'>{adults}</span>
                <button
                  type='button'
                  className='h-8 w-8 rounded-full border border-ink-300 text-ink-700'
                  onClick={() => setAdults((prev) => Math.max(1, prev + 1))}
                >
                  +
                </button>
              </div>
            </div>

            {/* Children */}
            <div className='flex items-center justify-between border-b border-ink-200 py-3'>
              <div>
                <p className='font-semibold text-ink-900'>Children</p>
                <p className='text-sm text-ink-500'>Ages 2 to 12</p>
              </div>
              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  className='h-8 w-8 rounded-full border border-ink-300 text-ink-700'
                  onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                >
                  -
                </button>
                <span className='w-5 text-center'>{children}</span>
                <button
                  type='button'
                  className='h-8 w-8 rounded-full border border-ink-300 text-ink-700'
                  onClick={() => setChildren((prev) => Math.max(0, prev + 1))}
                >
                  +
                </button>
              </div>
            </div>

            {/* Infants */}
            <div className='flex items-center justify-between border-b border-ink-200 py-3'>
              <div>
                <p className='font-semibold text-ink-900'>Infants</p>
                <p className='text-sm text-ink-500'>Under 2</p>
              </div>
              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  className='h-8 w-8 rounded-full border border-ink-300 text-ink-700'
                  onClick={() => setInfants((prev) => Math.max(0, prev - 1))}
                >
                  -
                </button>
                <span className='w-5 text-center'>{infants}</span>
                <button
                  disabled={infants >= MAX_INFANTS}
                  type='button'
                  className='h-8 w-8 rounded-full border border-ink-300 text-ink-700'
                  onClick={() => setInfants((prev) => Math.max(0, prev + 1))}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
