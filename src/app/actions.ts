'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { BOOK_STATUSES } from '@/lib/types';
import { auth } from '@/lib/auth';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  authors: z.array(z.string()).min(1, 'Author is required'),
  status: z.enum(BOOK_STATUSES),
  rating: z.number().int().min(0).max(5).nullable(),
  notes: z.string().optional(),
  coverUrl: z.string().url().optional().nullable(),
  openLibraryId: z.string().optional(),
  publishYear: z.number().optional(),
});

// Hardcoded demo user ID
const demoUserId = 'clx1v2q2y000012b1a51a1b1a';

export async function addBook(data: z.infer<typeof bookSchema>) {
  const validatedFields = bookSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid data provided.',
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  // This is a simulated action. It doesn't save to a database.
  console.log('Simulating adding book for user:', demoUserId, validatedFields.data);

  revalidatePath('/');
  return { success: true, book: validatedFields.data };
}
