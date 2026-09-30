/**
 * This file is going to contain helper function to help with making pages
 * and server actions can answer:
 * - Who is logged in right now?
 */
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

/**
 * This functions gets the current user from database by making some
 * controls if there is problem with cookies or if the user is not logged in.
 * If nothing crashes then we get the user.
 * @returns
 */
export async function getCurrentUser() {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    // If cookies are corrupt or expired in a bad way, then we treat the user
    // as logged out, instead of crashing the page.
    return null;
  }

  // If there are no session or no email on the session,
  // that means that nobody is signed in.
  if (!session?.user?.email) return null;

  // Look up in the database for the real user.
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // If user is available
  return user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      }
    : null;
}

/**
 * If user is not logged in, then redirect to login page.
 * Otherwise we get the user.
 * @returns
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}
