import type { Book } from '@prisma/client';

export type NormalizedBook = {
  title: string;
  subtitle?: string;
  authors: string[];
  coverUrl: string | null;
  openLibraryId: string;
  isbn: string[];
  publishYear?: number;
  pages?: number;
  publisher?: string;
  description?: string;
};

export type BookWithUser = Book & { user: { name: string | null } };

export const BOOK_STATUSES = ['Owned', 'Wishlist', 'Loaned', 'Completed'] as const;
export type BookStatus = typeof BOOK_STATUSES[number];
