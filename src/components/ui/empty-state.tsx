import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { uiShell } from '@/lib/ui-classes';

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className={uiShell.emptyState}>
      {Icon && <Icon className='mx-auto h-8 w-8 text-ink-400' />}
      <p className='mt-2 text-sm font-medium text-ink-700'>{title}</p>
      <p className='mt-1 text-sm text-ink-600'>{description}</p>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className='mt-3 inline-flex rounded-full border border-ink-300 px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-ink-50'
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
