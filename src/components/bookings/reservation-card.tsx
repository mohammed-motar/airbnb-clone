import Link from 'next/link';
import { format } from 'date-fns';
import { Clock3, MapPin } from 'lucide-react';
import { cancelReservation } from '@/app/actions';

type ReservationCardProps = {
  reservation: {
    id: string;
    listingId: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    listing: {
      title: string;
      locationValue: string;
    };
  };
  today: Date;
};

export function ReservationCard({ reservation, today }: ReservationCardProps) {
  const isActive = reservation.endDate >= today;
  return (
    <article className='rounded-2xl border border-ink-200 bg-surface p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md md:p-5'>
      <div className='min-w-0 space-y-2'>
        <h2 className='line-clamp-2 text-base font-semibold text-ink-900 md:text-lg'>
          {reservation.listing.title}
        </h2>
        <p className='inline-flex items-center gap-1.5 text-sm text-ink-600 mx-1'>
          <MapPin className='h-4 w-4 shrink-0' />
          {reservation.listing.locationValue}
        </p>
        <p className='inline-flex items-center gap-1.5 text-sm text-ink-700'>
          <Clock3 className='h-4 w-4 shrink-0' />
          {format(reservation.startDate, 'PPP')} -{' '}
          {format(reservation.endDate, 'PPP')}
        </p>
      </div>

      <div className='mt-3 border-t border-ink-200 pt-3'>
        <div className='flex items-start justify-between gap-3'>
          <p
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-ink-100 text-ink-700'}`}
          >
            {isActive ? 'Active' : 'Past'}
          </p>
          <div className='text-right'>
            <p className='text-xs text-ink-500'>Booking total</p>
            <p className='text-2xl font-semibold leading-none text-ink-900 md:text-lg mt-1'>
              ${reservation.totalPrice}
            </p>
          </div>
        </div>

        <div className='mt-3 grid gap-2 sm:flex sm:flex-wrap sm:justify-end'>
          <Link
            href={`/listings/${reservation.listingId}`}
            className='inline-flex w-full items-center justify-center rounded-xl border border-ink-300 px-3 py-2 text-sm font-semibold text-ink-700 transition hover:bg-ink-50 sm:w-auto sm:rounded-full sm:py-1 sm:text-xs'
          >
            View stay
          </Link>

          {isActive && (
            <form action={cancelReservation} className='w-full sm:w-auto'>
              <input
                type='hidden'
                name='reservationId'
                value={reservation.id}
              />
              <button
                type='submit'
                className='inline-flex w-full items-center justify-center rounded-xl border border-red-300 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 sm:w-auto sm:rounded-full sm:py-1 sm:text-xs'
              >
                Cancel reservation
              </button>
            </form>
          )}
        </div>
      </div>
    </article>
  );
}
