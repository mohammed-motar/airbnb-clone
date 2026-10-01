import Link from 'next/link';
import { BadgeCheck, HeartHandshake, House } from 'lucide-react';
import { registerUser } from '../actions';
import { RegisterForm } from '@/components/register-form';

function RegisterPage() {
  return (
    <main className='mx-auto flex min-h-[88vh] max-w-5xl items-center px-4 py-8 md:px-8'>
      <section className='grid w-full overflow-hidden rounded-3xl border border-ink-200 bg-surface shadow-sm md:grid-cols-2'>
        {/* Left column */}
        <div className='bg-gradient-to-br from-brand-100 via-brand-50 to-white p-8 md:p-10'>
          <p className='text-xs font-semibold uppercase tracking-[0.16em] text-brand-600'>
            Join Kaabi Travel
          </p>
          <h1 className='mt-3 text-3xl font-bold tracking-tight text-ink-900'>
            Create your account and start booking with confidence
          </h1>
          <p className='mt-3 text-sm leading-relaxed text-ink-600'>
            Save favorite homes, compare destinations, and manage every
            reservation in one place.
          </p>
          <div className='mt-8 space-y-3 text-sm text-ink-700'>
            <p className='flex items-center gap-2'>
              <House className='h-4 w-4 text-brand-500' />
              Browse thoughtfully curated US properties
            </p>
            <p className='flex items-center gap-2'>
              <BadgeCheck className='h-4 w-4 text-brand-500' />
              Manage bookings from a single dashboard
            </p>
            <p className='flex items-center gap-2'>
              <HeartHandshake className='h-4 w-4 text-brand-500' />
              Trusted host and guest experience
            </p>
          </div>
        </div>

        {/* Right column */}
        <div className='p-8 md:p-10'>
          <h2 className='text-2xl font-semibold text-ink-900'>
            Create account
          </h2>
          <p className='mt-1 text-sm text-ink-600'>
            Join Kaabi Travel to host homes or reserve stays.
          </p>
          <RegisterForm action={registerUser} />

          <p className='mt-5 text-sm text-ink-600'>
            Already registered?{' '}
            <Link
              href='/login'
              className='font-semibold text-brand-600 hover:text-brand-700'
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;
