'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { signIn } from 'next-auth/react';

type RegisterFormProps = {
  action: (formData: FormData) => Promise<void>;
};

function RegisterSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className='w-full rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-white hover:bg-brand-600 disabled:opacity-70'
      disabled={pending}
    >
      {pending ? 'Creating your account...' : 'Create account'}
    </button>
  );
}

/**
 * Two parallel signup paths in one UI
 * 1. native form Post -> Server actions (name, email, password fields)
 * 2. Button -> NextAuth Google Provider (client redirect)
 */
export function RegisterForm({ action }: RegisterFormProps) {
  const [googleLoading, setGoogleLoading] = useState(false);

  return (
    <>
      <form className='mt-5 space-y-3' action={action}>
        <input
          type='text'
          name='name'
          required
          placeholder='Full name'
          className='w-full rounded-xl border border-ink-300 px-3.5 py-2.5 text-ink-800 outline-none ring-brand-300 focus:ring-2'
        />
        <input
          type='email'
          name='email'
          required
          placeholder='Work or personal email'
          className='w-full rounded-xl border border-ink-300 px-3.5 py-2.5 text-ink-800 outline-none ring-brand-300 focus:ring-2'
        />
        <input
          type='password'
          name='password'
          required
          placeholder='Password (minimum 8 characters)'
          minLength={8}
          className='w-full rounded-xl border border-ink-300 px-3.5 py-2.5 text-ink-800 outline-none ring-brand-300 focus:ring-2'
        />

        <RegisterSubmitButton />
      </form>

      {/* OAuth */}
      <button
        className='mt-3 w-full rounded-xl border border-ink-300 px-4 py-2.5 font-semibold text-ink-700 hover:bg-ink-100 disabled:opacity-70'
        onClick={async () => {
          setGoogleLoading(true);
          await signIn('google', { callbackUrl: '/' });
        }}
      >
        {googleLoading ? 'Redirect to Google...' : 'Continue with Google'}
      </button>
    </>
  );
}
