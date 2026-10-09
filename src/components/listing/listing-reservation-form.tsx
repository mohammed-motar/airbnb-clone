'use client';

import { useMemo, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { type DateRange } from 'react-day-picker';
import { DateRangePicker } from '../date-range-picker';
import { format, getTime, isValid, subDays } from 'date-fns';
import Link from 'next/link';
import {
  MAX_INFANTS,
  MIN_ADULTS,
  PROCESSING_FEE_RATE,
} from '@/lib/booking-rules';
import { toValidate } from '@/lib/data-utils';

type ListingReservationFormProps = {
  listingId: string;
  pricePerNight: number;
  maxGuests: number;
  isLoggedIn: boolean;
  bookingStatus?: 'success' | 'error' | null;
  bookingMessage?: string | null;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: string;
  initialChildren?: string;
  initialInfants?: string;
  unavailableRanges?: Array<{
    startDate: Date;
    endDate: Date;
  }>;
  canBook?: boolean;
  blockedMessage?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ListingReservationForm({
  listingId,
  pricePerNight,
  maxGuests,
  isLoggedIn,
  bookingStatus = null,
  bookingMessage = null,
  initialCheckIn,
  initialCheckOut,
  initialAdults,
  initialChildren,
  initialInfants,
  unavailableRanges = [],
  canBook = true,
  blockedMessage = 'This listing is not currently bookable.',
}: ListingReservationFormProps) {
  const formAnchorId = `booking-panel-${listingId}`;
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const from = toValidate(initialCheckIn);
    const to = toValidate(initialCheckOut);
    if (!from && !to) return undefined;
    return { from, to };
  });

  const [adults, setAdults] = useState(() => {
    const parsed = Number(initialAdults ?? MIN_ADULTS);
    const safe = Number.isFinite(parsed) ? parsed : MIN_ADULTS;
    return clamp(safe, MIN_ADULTS, maxGuests);
  });

  const [children, setChildren] = useState(() => {
    const parsed = Number(initialChildren ?? 0);
    const safe = Number.isFinite(parsed) ? parsed : 0;
    return clamp(safe, 0, Math.max(0, maxGuests - adults));
  });

  const [infants, setInfants] = useState(() => {
    const parsed = Number(initialInfants ?? 0);
    const safe = Number.isFinite(parsed) ? parsed : 0;
    return clamp(
      safe,
      0,
      Math.min(MAX_INFANTS, Math.max(0, maxGuests - adults - children)),
    );
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const startDate = range?.from ? format(range.from, 'yyyy-MM-dd') : '';
  const endDate = range?.to ? format(range.to, 'yyyy-MM-dd') : '';

  /**
   * This memo function is for those who is not logged in. When they pick a stay
   * and want to book and goes to listing page, the'll get to see that they needs to login
   * so they can book.
   * If this function is not created, they the not logged in user needs to go back to
   * home page, create a account, login and then pick the stay again with how many
   * people should be in the stay.
   * This function helps with:
   * - When someone found a property listing and he is not logged in, the user needs to login.
   *   So what ever property he was in before creating the account, and when he creates the account
   *   then the user will be redirected back to that property stay he was in.
   *   This is best suer experience, he is saving more time and he does not need
   *   to login and do all the job again with finding the property he was in.
   */
  const loginCallbackUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (startDate) params.set('checkIn', startDate);
    if (endDate) params.set('checkOut', endDate);
    params.set('adults', String(adults));
    params.set('children', String(children));
    params.set('infants', String(infants));

    const queryString = params.toString();
    return `/listings/${listingId}${queryString ? `?${queryString}` : ''}`;
  }, [adults, children, endDate, infants, listingId, startDate]);

  const disabledRanges = useMemo(
    () =>
      unavailableRanges
        .map((rangeItem) => ({
          from: rangeItem.startDate,
          to: subDays(rangeItem.endDate, 1),
        }))
        .filter(
          (rangeItem) =>
            isValid(rangeItem.from) &&
            isValid(rangeItem.to) &&
            rangeItem.to >= rangeItem.from,
        ),
    [unavailableRanges],
  );

  const nights = useMemo(() => {
    if (!range?.from || !range.to) return 0;
    const diff = range.to.getTime() - range.from.getTime();
    const totalNights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return totalNights > 0 ? totalNights : 0;
  }, [range]);

  const subTotal = nights * pricePerNight;
  const processingFee = Math.round(subTotal * PROCESSING_FEE_RATE);
  const total = subTotal + processingFee;

  // Early return: host preview, draft
  if (!canBook) {
    return (
      <div
        id={formAnchorId}
        className='rounded-2xl border border-ink-200 bg-surface p-5'
      >
        <p className='text-sm text-ink-700'>{blockedMessage}</p>
      </div>
    );
  }

  // Early return: when guest user try to book.
  if (!isLoggedIn) {
    return (
      <div
        id={formAnchorId}
        className='rounded-2xl border-ink-200 bg-surface p-5'
      >
        <p className='text-sm text-ink-700'>
          Sign in to continue and reserve this stay.
        </p>
        <Link
          href={{
            pathname: '/login',
            query: { callbackUrl: loginCallbackUrl },
          }}
          className='mt-3 inline-flex rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600'
        >
          Sign in to continue
        </Link>
      </div>
    );
  }

  const totalGuests = adults + children + infants;
  const atGuestCapacity = totalGuests >= maxGuests;
  const maxChildrenAllowed = Math.max(0, maxGuests - adults - infants);
  const maxInfantsByCapacity = Math.max(0, maxGuests - adults - children);

  return (
    <form
      id={formAnchorId}
      className='space-y-4 rounded-2xl border border-ink-200 bg-surface p-5'
    >
      {bookingStatus === 'success' ? (
        <p
          aria-live='polite'
          className='rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700'
        >
          Booking confirmed. You can manage it from your bookings page.
        </p>
      ) : null}
      {bookingStatus === 'error' ? (
        <p
          aria-live='assertive'
          className='rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700'
        >
          {bookingMessage ??
            'Unable to complete reservation. Please try again.'}
        </p>
      ) : null}

      <input type='hidden' name='listingId' value={listingId} />
      <input type='hidden' name='startDate' value={startDate} />
      <input type='hidden' name='endDate' value={endDate} />
      <input type='hidden' name='adults' value={adults} />
      <input type='hidden' name='children' value={children} />
      <input type='hidden' name='infants' value={infants} />

      <button
        className='w-full space-y-3 rounded-2xl border border-ink-200 p-3 text-left transition hover:border-ink-300 hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300'
        aria-label='Open date picker panel'
        onClick={() => setIsCalendarOpen(true)}
        type='button'
      >
        <div className='flex items-center justify-between gap-3'>
          <div>
            <p className='text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-500'>
              Check-in
            </p>
            <p className='mt-1 text-sm font-semibold text-ink-900'>
              {range?.to ? format(range.to, 'MMM d, yyyy') : 'Add date'}
            </p>
          </div>
          <div className='h-8 w-px bg-ink-200' />
          <div className='text-right'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-500'>
              Checkout
            </p>
            <p className='mt-1 text-sm font-semibold text-ink-900'>
              {range?.to ? format(range.to, 'MMM d, yyyy') : 'Add date'}
            </p>
          </div>
        </div>
      </button>

      <div className='space-y-3 rounded-2xl border border-ink-200 bg-surface-muted p-3'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-xs font-semibold text-ink-900'>Guests</p>
            <p className='text-xs text-ink-500'>
              {totalGuests} guest{totalGuests === 1 ? '' : 's'} · Max{' '}
              {maxGuests}
            </p>
          </div>
        </div>
        <div className='space-y-3 border-t border-ink-200 pt-3 text-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='font-medium text-ink-900'>Adults</p>
              <p className='text-xs text-ink-500'>Ages 13 or above</p>
            </div>
            <div className='flex items-center gap-3'>
              <button
                type='button'
                className='flex h-8 w-8 items-center justify-center rounded-full border border-ink-300 text-ink-700 disabled:opacity-40'
                disabled={adults <= MIN_ADULTS}
                onClick={() =>
                  setAdults((prev) => Math.max(MIN_ADULTS, prev - 1))
                }
              >
                -
              </button>
              <span className='w-5 text-center'>{adults}</span>
              <button
                type='button'
                className='flex h-8 w-8 items-center justify-center rounded-full border border-ink-300 text-ink-700 disabled:opacity-40'
                disabled={atGuestCapacity}
                onClick={() =>
                  setAdults((prev) => Math.min(maxGuests, prev + 1))
                }
              >
                +
              </button>
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <div>
              <p className='font-medium text-ink-900'>Children</p>
              <p className='text-xs text-ink-500'>Ages 2–12</p>
            </div>
            <div className='flex items-center gap-3'>
              <button
                type='button'
                className='flex h-8 w-8 items-center justify-center rounded-full border border-ink-300 text-ink-700 disabled:opacity-40'
                disabled={children <= 0}
                onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
              >
                -
              </button>
              <span className='w-5 text-center'>{children}</span>
              <button
                type='button'
                className='flex h-8 w-8 items-center justify-center rounded-full border border-ink-300 text-ink-700 disabled:opacity-40'
                disabled={atGuestCapacity}
                onClick={() =>
                  setChildren((prev) => Math.min(maxChildrenAllowed, prev + 1))
                }
              >
                +
              </button>
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <div>
              <p className='font-medium text-ink-900'>Infants</p>
              <p className='text-xs text-ink-500'>Under 2</p>
            </div>
            <div className='flex items-center gap-3'>
              <button
                type='button'
                className='flex h-8 w-8 items-center justify-center rounded-full border border-ink-300 text-ink-700 disabled:opacity-40'
                disabled={infants <= 0}
                onClick={() => setInfants((prev) => Math.max(0, prev - 1))}
              >
                -
              </button>
              <span className='w-5 text-center'>{infants}</span>
              <button
                type='button'
                className='flex h-8 w-8 items-center justify-center rounded-full border border-ink-300 text-ink-700 disabled:opacity-40'
                disabled={infants >= 2 || atGuestCapacity}
                onClick={() =>
                  setInfants((prev) =>
                    Math.min(MAX_INFANTS, maxInfantsByCapacity, prev + 1),
                  )
                }
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className='text-xs text-ink-500'>
        Reserved dates are unavailable. Choose check-in and checkout dates, then
        confirm traveler count to continue.
      </p>

      {isCalendarOpen && (
        <div className='fixed inset-0 z-30 flex items-center justify-center bg-ink-900/30 backdrop-blur-[1px]'>
          <div className='w-full max-w-md rounded-3xl border border-ink-200 bg-surface p-4 shadow-xl md:p-5'>
            <div className='mb-3 flex items-center justify-between'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.18em] text-ink-500'>
                  Select dates
                </p>
                <p className='mt-1 text-sm text-ink-600'>
                  Select your preferred check-in and checkout dates.
                </p>
              </div>
              <button
                type='button'
                className='rounded-full border border-ink-300 px-3 py-1 text-xs font-medium text-ink-700 hover:bg-ink-100'
                onClick={() => setIsCalendarOpen(false)}
              >
                Done
              </button>
            </div>

            <div className='rounded-2xl border border-ink-100 bg-surface-muted px-2 pb-3 pt-2'>
              <DateRangePicker
                selected={range}
                onSelect={setRange}
                disabled={disabledRanges}
                numberOfMonths={1}
                className='hero-daypicker mx-auto w-full max-w-full'
              />
            </div>
          </div>
        </div>
      )}

      <div className='rounded-xl bg-ink-50 p-3 text-sm text-ink-700'>
        <div className='flex items-center justify-between'>
          <span>
            ${pricePerNight} x {nights || 0} nights
          </span>
          <span>${subTotal}</span>
        </div>
        <div className='mt-2 flex items-center justify-between'>
          <span>Processing fee (8%)</span>
          <span>${processingFee}</span>
        </div>
        <div className='mt-2 flex items-center justify-between border-t border-ink-200 pt-2 text-base font-semibold text-ink-900'>
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type='button'
      disabled={pending}
      className='w-full rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70'
    >
      {pending ? 'Confirming...' : 'Reserve now'}
    </button>
  );
}
