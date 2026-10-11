import { uiShell } from '@/lib/ui-classes';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

type PageIntroProps = {
  badge: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: ReactNode;
};

export function PageIntro({
  badge,
  title,
  description,
  icon: Icon,
  action,
}: PageIntroProps) {
  return (
    <section className={uiShell.sectionCard}>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <p className='inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600'>
            {Icon ? <Icon className='h-3.5 w-3.5' /> : null}
            {badge}
          </p>
          <h1 className='mt-3 text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl'>
            {title}
          </h1>
          <p className='mt-2 max-w-2xl text-sm text-ink-600 md:text-base'>
            {description}
          </p>
        </div>

        {action ? <div>{action}</div> : null}
      </div>
    </section>
  );
}
