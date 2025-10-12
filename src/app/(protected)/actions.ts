'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { BOOK_STATUSES } from '@/lib/types';

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


export async function addBook(data: z.infer<typeof bookSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  const validatedFields = bookSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid data provided.',
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.book.create({
      data: {
        ...validatedFields.data,
        userId: session.user.id,
      },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to add book:', error);
    return { success: false, error: 'A server error occurred.' };
  }
}
