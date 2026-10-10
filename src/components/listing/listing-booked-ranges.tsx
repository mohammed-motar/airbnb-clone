import { CalendarDays } from 'lucide-react';

type ListingBookedRangesProps = {
  bookedRanges: Array<{
    startDate: Date;
    endDate: Date;
  }>;
};

export function ListingBookedRanges({
  bookedRanges,
}: ListingBookedRangesProps) {
  if (bookedRanges.length === 0) return null;

  return (
    <section className='rounded-3xl border border-ink-200 bg-gradient-to-br from-surface via-surface to-ink-50/70 p-4 shadow-sm md:p-5'>
      <div className='flex flex-wrap items-center justify-between gap-3 border-b border-ink-200 pb-3'>
        <div className='inline-flex items-center gap-2'>
          <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600'>
            <CalendarDays className='h-4 w-4' />
          </span>
          <h2 className='text-sm font-semibold text-ink-900 md:text-base'>
            Recent Reservations
          </h2>
        </div>

        <p className='rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-medium text-ink-600'>
          {bookedRanges.length} recent booking
          {bookedRanges.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className='mt-3 flex flex-wrap gap-2 text-xs text-ink-700'>
        {bookedRanges.map((range, index) => (
          <span
            key={`${range.startDate.toISOString()}-${index}`}
            className='inline-flex items-center gap-1 rounded-full border border-ink-200 bg-surface px-3 py-1.5 font-medium shadow-sm'
          >
            {range.startDate.toLocaleDateString()} -{' '}
            {range.endDate.toLocaleDateString()}
          </span>
        ))}
      </div>
    </section>
  );
}
