'use client';

// useMemo lets you cache the result of a calculation between re-renders.
import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { House, ShieldCheck, Sparkles } from 'lucide-react';

function LoginPage() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * callback url.
   * useMemo recalculates only when the search params changes.
   */
  const callbackUrl = useMemo(() => {
    const requested = searchParams.get('callbackUrl') ?? '/';
    if (!requested.startsWith('/') || requested.startsWith('//')) return '/';
    return requested;
  }, [searchParams]);

  async function onCredentialsLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: true,
      callbackUrl,
    });

    if (result?.error) {
      setError('Invalid email or password.');
      setIsLoading(false);
    }
  }

  return (
    <main className='mx-auto flex min-h-[88vh] max-w-5xl items-center px-4 md:px-8'>
      <section className='grid w-full overflow-hidden rounded-3xl border border-ink-200 bg-surface shadow-sm md:grid-cols-2'>
        <div className='bg-gradient-to-br from-brand-50 via-white to-brand-100 p-8 md:p-10'>
          <p className='text-xs font-semibold uppercase tracking-[0.16em] text-brand-600'>
            Welcome back
          </p>
          <h1 className='mt-3 text-3xl font-bold tracking-tight text-ink-900'>
            Sign in to continue your travel plans
          </h1>
          <p className='mt-3 text-sm leading-relaxed text-ink-600'>
            Access your bookings, manage your host activity, and continue
            exploring stays across top US destinations.
          </p>
          <div className='mt-8 space-y-3 text-sm text-ink-700'>
            <p className='flex items-center gap-2'>
              <House className='h-4 w-4 text-brand-500' />
              Personalized home recommendations
            </p>
            <p className='flex items-center gap-2'>
              <ShieldCheck className='h-4 w-4 text-brand-500' />
              Secure account access
            </p>
            <p className='flex items-center gap-2'>
              <Sparkles className='h-4 w-4 text-brand-500' />
              Streamlined booking experience
            </p>
          </div>
        </div>

        <div className='p-8 md:p-10'>
          <h2 className='text-2xl font-semibold text-ink-900'>Sign in</h2>
          <p className='mt-1 text-sm text-ink-600'>
            Continue as a guest or host
          </p>
          <form className='mt-5 space-y-3' onSubmit={onCredentialsLogin}>
            <input
              type='email'
              required
              placeholder='Work or personal email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className='w-full rounded-xl border border-ink-300 px-3.5 py-2.5 text-ink-800 outline-none ring-brand-300 focus:ring-2'
            />
            <input
              type='password'
              required
              placeholder='Password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className='w-full rounded-xl border border-ink-300 px-3.5 py-2.5 text-ink-800 outline-none ring-brand-300 focus:ring-2'
            />
            {/* If there is error */}
            {error ? <p className='text-sm text-brand-700'>{error}</p> : null}
            <button
              className='w-full rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-white hover:bg-brand-600 disabled:opacity-70'
              disabled={isLoading}
            >
              {isLoading ? 'Signing you in...' : 'Sign in'}
            </button>
          </form>

          {/* Google OAuth */}
          <button
            className='mt-3 w-full rounded-xl border border-ink-300 px-4 py-2.5 font-semibold text-ink-700 hover:bg-ink-100'
            type='button'
            onClick={() => signIn('google', { callbackUrl })}
          >
            Sign in with Google
          </button>

          <p className='mt-5 text-sm text-ink-600'>
            New here?{' '}
            <Link
              href='/register'
              className='font-semibold text-brand-600 hover:text-brand-700'
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
