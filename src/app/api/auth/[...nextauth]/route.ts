/**
 * The folder that we created [...nextauth] is
 * a Next.js catch all dynamic segment.
 * It handles every path under --> /api/auth
 */
import NextAuth from 'next-auth';
import { authOptions } from '@/auth/config';

// as never normally means a value that can never exist. It's commonly used for things like functions that never return:
const handler = NextAuth(authOptions as never);

export { handler as GET, handler as POST };
