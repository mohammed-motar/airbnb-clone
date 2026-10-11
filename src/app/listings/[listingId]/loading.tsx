export default function ListingDetailsLoading() {
  return (
    <main
      role='status'
      aria-label='Loading listing details'
      className='mx-auto min-h-screen max-w-7xl animate-pulse px-4 pb-10 pt-5 md:px-8 md:pt-8'
    >
      <article className='space-y-6 md:space-y-8'>
        <div className='grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:items-start'>
          <div className='space-y-6 md:space-y-7'>
            <section className='overflow-hidden rounded-3xl border border-ink-200 bg-surface shadow-sm'>
              <div className='h-[280px] w-full bg-ink-200 md:h-[420px]' />
              <div className='space-y-3 p-5 md:p-6'>
                <div className='h-6 w-28 rounded-full bg-ink-200' />
                <div className='h-10 w-3/4 max-w-xl rounded-lg bg-ink-200' />
                <div className='flex flex-wrap gap-3'>
                  <div className='h-5 w-40 rounded bg-ink-200' />
                  <div className='h-5 w-32 rounded bg-ink-200' />
                </div>
              </div>
            </section>

            <section className='rounded-3xl border border-ink-200 bg-surface p-5 shadow-sm md:p-6'>
              <div className='h-6 w-40 rounded bg-ink-200' />
              <div className='mt-4 space-y-2'>
                <div className='h-4 w-full rounded bg-ink-200' />
                <div className='h-4 w-full rounded bg-ink-200' />
                <div className='h-4 w-2/3 rounded bg-ink-200' />
              </div>
              <div className='mt-5 flex flex-wrap gap-2'>
                <div className='h-9 w-24 rounded-full bg-ink-200' />
                <div className='h-9 w-24 rounded-full bg-ink-200' />
                <div className='h-9 w-24 rounded-full bg-ink-200' />
              </div>
            </section>

            <section className='rounded-3xl border border-ink-200 bg-surface p-4 shadow-sm md:p-5'>
              <div className='mb-3 flex items-center justify-between gap-3'>
                <div className='h-5 w-40 rounded bg-ink-200' />
                <div className='h-6 w-28 rounded-full bg-ink-200' />
              </div>
              <div className='flex flex-wrap gap-2'>
                <div className='h-8 w-32 rounded-full bg-ink-100' />
                <div className='h-8 w-36 rounded-full bg-ink-100' />
                <div className='h-8 w-28 rounded-full bg-ink-100' />
              </div>
            </section>

            <section className='rounded-3xl border border-ink-200 bg-surface p-3 md:p-4'>
              <div className='mb-3 h-6 w-28 rounded bg-ink-200 px-2' />
              <div className='h-72 w-full rounded-2xl bg-ink-200' />
            </section>
          </div>

          <aside className='space-y-4 lg:sticky lg:top-20 lg:self-start'>
            <section className='rounded-3xl border border-ink-200 bg-surface p-5 shadow-sm'>
              <div className='h-9 w-32 rounded-lg bg-ink-200' />
              <div className='mt-2 h-4 w-40 rounded bg-ink-200' />
              <div className='mt-4 space-y-3'>
                <div className='rounded-2xl border border-ink-200 p-3'>
                  <div className='mb-3 flex items-center justify-between'>
                    <div className='h-10 w-28 rounded bg-ink-200' />
                    <div className='h-10 w-28 rounded bg-ink-200' />
                  </div>
                  <div className='h-64 rounded-2xl bg-ink-100' />
                </div>
                <div className='h-24 rounded-xl bg-ink-100' />
                <div className='h-11 rounded-xl bg-ink-200' />
              </div>
            </section>
          </aside>
        </div>
      </article>
    </main>
  );
}
