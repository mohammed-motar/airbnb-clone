import { CalendarCheck2 } from 'lucide-react';
import { ListingReservationForm } from './listing-reservation-form';

type ListingBookingSidebarProps = {
  listingId: string;
  pricePerNight: number;
  hostName: string;
  reservationCount: number;
  userActiveReservation?: {
    startDate: Date;
    endDate: Date;
  } | null;
  maxGuests: number;
  isLoggedIn: boolean;
  bookingStatus?: 'success' | 'error' | null;
  bookingMessage?: string | null;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: string;
  initialChildren?: string;
  initialInfants?: string;
  unavailableRanges: Array<{
    startDate: Date;
    endDate: Date;
  }>;
};

export function ListingBookingSidebar({
  listingId,
  pricePerNight,
  hostName,
  reservationCount,
  userActiveReservation,
  maxGuests,
  isLoggedIn,
  bookingStatus,
  bookingMessage,
  initialCheckIn,
  initialCheckOut,
  initialAdults,
  initialChildren,
  initialInfants,
  unavailableRanges,
}: ListingBookingSidebarProps) {
  return (
    <aside className='space-y-4 lg:sticky lg:top-20 lg:self-start'>
      <section className='rounded-3xl border border-ink-200 bg-surface p-5 shadow-lg shadow-ink-900/5'>
        <div className='flex items-baseline justify-between'>
          <p className='text-2xl font-semibold text-ink-900'>
            ${pricePerNight}
            <span className='ml-1 text-sm font-medium text-ink-600'>
              / night
            </span>
          </p>

          <p className='hidden text-xs text-ink-500 md:block'>
            {reservationCount > 0
              ? `${reservationCount} booking${reservationCount > 1 ? 's' : ''}`
              : 'No bookings yet'}
          </p>
        </div>

        {userActiveReservation ? (
          <div className='mt-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/70 p-3 shadow-sm shadow-emerald-900/5'>
            <div className='flex items-start gap-2.5'>
              <span className='inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white'>
                <CalendarCheck2 className='h-4 w-4' />
              </span>

              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800'>
                  You are booked
                </p>
                <p className='mt-1 text-sm font-medium text-emerald-900'>
                  You already have a reservation for this stay.
                </p>
                <p className='mt-1 text-xs text-emerald-800'>
                  {userActiveReservation.startDate.toLocaleDateString()} -{' '}
                  {userActiveReservation.endDate.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <p className='mt-1 text-xs text-ink-500 md:hidden'>
          Hosted by {hostName}
        </p>
        <div className='mt-4'>
          <ListingReservationForm
            listingId={listingId}
            pricePerNight={pricePerNight}
            maxGuests={maxGuests}
            isLoggedIn={isLoggedIn}
            bookingStatus={bookingStatus}
            bookingMessage={bookingMessage}
            initialCheckIn={initialCheckIn}
            initialCheckOut={initialCheckOut}
            initialAdults={initialAdults}
            initialChildren={initialChildren}
            initialInfants={initialInfants}
            unavailableRanges={unavailableRanges}
          />
        </div>
      </section>

      <div className='fixed inset-x-0 bottom-0 z-30 border-t border-ink-200 bg-surface/95 px-4 py-3 shadow-[0_-8px_24px_-18px_rgba(15,23,42,0.35)] backdrop-blur md:px-6 lg:hidden'>
        <div className='mx-auto flex w-full max-w-7xl items-center justify-between gap-3'>
          <p className='text-sm text-ink-700'>
            <span className='text-base font-semibold text-ink-900'>
              ${pricePerNight}
            </span>
            <span className='ml-1'>/ night</span>
          </p>
          <a
            href={`#booking-panel-${listingId}`}
            className='inline-flex rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600'
          >
            {isLoggedIn ? 'Book this stay' : 'Sign in to book this stay'}
          </a>
        </div>
      </div>
    </aside>
  );
}
