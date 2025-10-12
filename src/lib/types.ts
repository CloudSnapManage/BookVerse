import type { Book as PrismaBook, Movie as PrismaMovie } from '@prisma/client';

// Add mediaType to Prisma-generated types
export type Book = PrismaBook & { mediaType: 'Book' };
export type Movie = PrismaMovie & { mediaType: 'Movie' };

// We'll create a new type for Anime based on the Movie model, as they share many fields
export type Anime = Omit<PrismaMovie, 'mediaType'> & { 
    mediaType: 'Anime',
    episodes?: number | null;
    jikanMalId?: number | null;
    favoriteEpisode?: string | null;
};

// We'll create a new type for KDrama based on the Movie model as well
export type KDrama = Omit<PrismaMovie, 'mediaType'> & {
    mediaType: 'KDrama',
    episodes?: number | null;
    tmdbId?: number | null;
    favoriteEpisode?: string | null;
}

export type MediaType = 'Book' | 'Movie' | 'Anime' | 'KDrama';

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

export type NormalizedAnime = {
    mediaType: 'Anime',
    title: string,
    posterUrl: string | null;
    jikanMalId: number;
    episodes?: number | null;
    overview?: string | null;
    year?: number | null;
}

export type NormalizedKDrama = {
    mediaType: 'KDrama',
    title: string,
    posterUrl: string | null;
    tmdbId: number;
    episodes?: number | null;
    overview?: string | null;
    releaseYear?: number;
}


export type NormalizedMedia = NormalizedBook | NormalizedMovie | NormalizedAnime | NormalizedKDrama;

export const BOOK_STATUSES = ['Owned', 'Wishlist', 'Loaned', 'Completed'] as const;
export type BookStatus = typeof BOOK_STATUSES[number];

export const MOVIE_STATUSES = ['Owned', 'Wishlist', 'Watched'] as const;
export type MovieStatus = typeof MOVIE_STATUSES[number];

export const ANIME_STATUSES = ['Watching', 'Completed', 'On-Hold', 'Dropped', 'Plan to Watch'] as const;
export type AnimeStatus = typeof ANIME_STATUSES[number];

export const KDRAMA_STATUSES = ['Watching', 'Completed', 'On-Hold', 'Dropped', 'Plan to Watch'] as const;
export type KDramaStatus = typeof KDRAMA_STATUSES[number];