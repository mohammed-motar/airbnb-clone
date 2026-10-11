export default function loading() {
  return (
    <main
      role='status'
      aria-label='Loading homepage'
      className='mx-auto w-full min-h-screen max-w-7xl px-4 pb-12 pt-6 md:px-8'
    >
      <section
        aria-hidden
        className='animate-pulse rounded-3xl border border-ink-200 bg-surface p-6 md:p-10'
      >
        <div className='mx-auto max-w-3xl space-y-3 text-center'>
          <div className='mx-auto h-3 w-56 rounded bg-ink-200' />
          <div className='mx-auto h-8 w-96 rounded bg-ink-200' />
          <div className='mx-auto h-4 w-80 rounded bg-ink-200' />
        </div>

        <div className='mx-auto mt-8 h-20 max-w-5xl rounded-3xl border border-ink-200 bg-ink-100' />

        <div className='mx-auto mt-6 flex max-w-5xl gap-2 overflow-hidden'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='h-10 w-32 rounded-full bg-ink-100"'
            ></div>
          ))}
        </div>
      </section>

      <section className='mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {Array.from({ length: 12 }).map((_, index) => (
          <article key={index} className='space-y-2 animate-pulse'>
            <div className='h-48 w-full rounded-2xl bg-ink-200' />
            <div className='h-3 w-28 rounded bg-ink-200' />
            <div className='h-4 w-40 rounded bg-ink-200' />
            <div className='h-3 w-32 rounded bg-ink-200' />
          </article>
        ))}
      </section>
    </main>
  );
}
