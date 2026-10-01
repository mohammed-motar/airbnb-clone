import { getCurrentUser } from '@/lib/auth';
import { House } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import AuthButtons from './auth-buttons';

export default async function Navbar() {
  const user = await getCurrentUser();

  // Check if user is logged in and see if the user has more than 0 listings.
  const hasHostedListings = user
    ? (await prisma.listing.count({ where: { userId: user.id } })) > 0
    : false;
  const hostCtaLabel = hasHostedListings ? 'Manage hosting' : 'Start hosting';

  return (
    <header className='sticky top-0 z-40 border-b border-ink-200/80 bg-surface/95 backdrop-blur'>
      <nav className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4'>
        <Link
          href='/'
          className='flex items-center gap-2 text-lg font-bold tracking-tight text-brand-600'
        >
          <House className='h-5 w-5' />
          <span>Kaabi Travel</span>
        </Link>

        <div className='flex items-center gap-2'>
          <Link
            href='/host'
            className='hidden rounded-full px-3 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-100 md:inline-block'
          >
            {hostCtaLabel}
          </Link>

          {/* Auth Buttons */}
          <AuthButtons user={user} />
        </div>
      </nav>
    </header>
  );
}

// export default Navbar;
