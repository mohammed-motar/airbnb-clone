import type { ReactNode } from 'react';
type HostSectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};
export function HostSection({
  title,
  description,
  action,
  children,
}: HostSectionProps) {
  return (
    <section className='rounded-3xl border border-ink-200 bg-surface p-5 shadow-sm md:p-6'>
      <div className='mb-5 flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h2 className='text-lg font-semibold text-ink-900 md:text-xl'>
            {title}
          </h2>
          {description ? (
            <p className='mt-1 text-sm text-ink-600'>{description}</p>
          ) : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
