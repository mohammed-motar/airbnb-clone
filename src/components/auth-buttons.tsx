'use client';

import Link from 'next/link';
import { Menu, UserCircle2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

type AuthButtonsProps = {
  user: { id: string; name?: string | null } | null;
  hostCtaLabel?: string;
};

export default function AuthButtons({
  user,
  hostCtaLabel = 'Start hosting',
}: AuthButtonsProps) {
  // Guest path
  // Not authenticated users.
  if (!user) {
    return (
      <div className='flex items-center gap-2'>
        <Link
          href='/login'
          className='rounded-full border border-ink-300 px-3 py-1.5 text-xs font-semibold text-ink-700'
        >
          Sing in
        </Link>
        <Link
          href='/register'
          className='rounded-full bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600'
        >
          Create account
        </Link>
      </div>
    );
  }

  // Authenticated users
  return <UserMenu name={user.name ?? 'Host'} hostCtaLabel={hostCtaLabel} />;
}

function UserMenu({
  name,
  hostCtaLabel,
}: {
  name: string;
  hostCtaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // When clicking outside the hamburger menu or click back at the icon, then close the menu!
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!menuRef.current) return;
      const target = event.target as Node | null;
      if (target && !menuRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    // Clean the event listeners by removing them.
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className='relative' ref={menuRef}>
      <button
        className='flex items-center gap-2 rounded-full border border-ink-300 bg-surface px-3 py-2 shadow-sm'
        type='button'
        onClick={() => setOpen((prev) => !prev)}
      >
        <Menu className='h-4 w-4 text-ink-700' />
        <UserCircle2 className='h-6 w-6 text-ink-500' />
      </button>

      {open ? (
        <div className='absolute right-0 top-12 z-50 w-48 rounded-2xl border border-ink-200 bg-surface p-2 shadow-xl'>
          <p className='px-3 py-2 text-xs font-bold text-ink-500'>{name}</p>
          <Link
            href='/bookings'
            className='block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-ink-700 hover:bg-ink-100'
            onClick={() => setOpen(false)}
          >
            Bookings
          </Link>
          <Link
            href='/host'
            className='block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-ink-700 hover:bg-ink-100 md:hidden'
            onClick={() => setOpen(false)}
          >
            {hostCtaLabel}
          </Link>
          <button
            className='w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-ink-700 hover:bg-ink-100'
            type='button'
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
