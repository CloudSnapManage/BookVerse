import type { Book } from '@prisma/client';

export type MediaType = 'Book' | 'Movie';

export type NormalizedBook = {
  mediaType: 'Book';
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

export type NormalizedMovie = {
  mediaType: 'Movie';
  title: string;
  posterUrl: string | null;
  tmdbId: number;
  releaseYear?: number;
  overview?: string;
};

export type NormalizedMedia = NormalizedBook | NormalizedMovie;

export type BookWithUser = Book & { user: { name: string | null } };

export const BOOK_STATUSES = ['Owned', 'Wishlist', 'Loaned', 'Completed'] as const;
export type BookStatus = typeof BOOK_STATUSES[number];

export const MOVIE_STATUSES = ['Owned', 'Wishlist', 'Watched'] as const;
export type MovieStatus = typeof MOVIE_STATUSES[number];
