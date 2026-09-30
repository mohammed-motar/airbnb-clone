/**
 * We are creating this file with this name and not a file that is API routes,
 * this is because:
 * Server action pair naturally with HTML form tag --> <form></form>
 * Next.js serializes that form data and then posts it for us.
 * We this this better than writing fetch API POST method by hand, (It's better approach)
 */
'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

/**
 * Schema for register
 */
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function registerUser(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If registration did fail or if it is not valid.
  if (!parsed.success) throw new Error('Invalid registration input.');

  // Prevent duplicate emails.
  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) throw new Error('Email already exists.');

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      hashedPassword,
    },
  });

  redirect('/login');
}
