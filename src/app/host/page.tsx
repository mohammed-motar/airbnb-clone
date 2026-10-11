import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { BadgeCheck, Building2, DollarSign, Sparkles } from 'lucide-react';
import { PageIntro } from '@/components/ui/page-intro';
import { StatCard } from '@/components/ui/stat-card';
import { EmptyState } from '@/components/ui/empty-state';
import { uiShell } from '@/lib/ui-classes';
import { HostSection } from '@/components/host/host-section';

export default async function HostDashBoardPage() {
  const user = await requireUser();
  const listings = await prisma.listing.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  const listingCount = listings.length;
  const averageNightlyRate = listingCount
    ? Math.round(
        listings.reduce((total, listing) => total + listing.pricePerNight, 0) /
          listingCount,
      )
    : 0;

  const totalCapacity = listings.reduce(
    (total, listing) => total + listing.guestCount,
    0,
  );

  return (
    <main className={uiShell.pageContainer}>
      <PageIntro
        badge='Host workspace'
        icon={Sparkles}
        title={`Welcome back, ${user.name ?? 'Host'}`}
        description='Manage your homes, publish new listings, and keep every stay ready for guests.'
      />

      <section className='mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        <StatCard
          label='Active Listings'
          value={listingCount}
          icon={Building2}
        />
        <StatCard
          label='Average Nightly Rate'
          value={`$${averageNightlyRate}`}
          icon={DollarSign}
        />
        <StatCard
          label='Total Guest Capacity'
          value={totalCapacity}
          icon={BadgeCheck}
        />
      </section>

      <div className='mt-6 grid gap-6 xl:grid-cols-[1.1fr_1fr]'>
        <HostSection
          title='Create a listing'
          description='Add a professionally presented listing with photos, pricing, and guest details.'
        ></HostSection>

        <HostSection
          title='Your listings'
          description='Update, review, or remove homes from your hosting portfolio.'
          action={
            <Link
              href='/'
              className='rounded-full border border-ink-300 px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-ink-50'
            >
              View guest experience
            </Link>
          }
        >
          <div className='space-y-3'>
            {listings.length === 0 ? (
              <EmptyState
                title='No listings yet'
                description='Fill in the form to publish your first property.'
              />
            ) : (
              listings.map((listing, index) => <p>Hotlistingitem</p>)
            )}
          </div>
        </HostSection>
      </div>
    </main>
  );
}
