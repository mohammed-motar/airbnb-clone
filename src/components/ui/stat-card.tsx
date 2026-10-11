import { uiShell } from '@/lib/ui-classes';
import { LucideIcon } from 'lucide-react';

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: LucideIcon;
};

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <article className={uiShell.panelCard}>
      <div className='flex items-center justify-between'>
        <p className='text-xs font-semibold uppercase tracking-[0.14em] text-ink-500'>
          {label}
        </p>
        {Icon ? (
          <span className='rounded-full bg-brand-50 p-2 text-brand-600'>
            <Icon className='h-4 w-4' />
          </span>
        ) : null}
      </div>
      <p className='mt-2 text-2xl font-semibold text-ink-900'>{value}</p>
    </article>
  );
}
