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
const demoUserId = 'demo-user-id';

export async function addBook(data: z.infer<typeof bookSchema>) {
  const validatedFields = bookSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid data provided.',
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // We can't actually create a book without a database.
    // For now, we will simulate success.
    // In a real scenario with a DB, you would uncomment the following:
    /*
    await prisma.book.create({
      data: {
        ...validatedFields.data,
        userId: demoUserId,
      },
    });
    */

    console.log('Simulating adding book for user:', demoUserId, validatedFields.data);
    
    // Since we are not using a database right now, revalidation won't show new books.
    // This is expected behavior for now.
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to add book:', error);
    // This error will likely be a database connection error
    // because of the local environment issues we saw earlier.
    return { success: false, error: 'A server error occurred.' };
  }
}
