// --- Base Media Item ---
// This is the core structure every media item will have.
interface MediaItem {
  id: string;
  title: string;
  status: string;
  rating: number | null;
  notes: string | null;
  description: string | null;
  coverUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// --- Specific Media Types ---
// Each type extends the base MediaItem and adds its own unique fields.

export type Book = MediaItem & {
  mediaType: 'Book';
  authors: string[];
  subtitle?: string | null;
  openLibraryId?: string | null;
  isbn?: string[] | null;
  publishYear?: number | null;
  pages?: number | null;
};

export type Movie = MediaItem & {
  mediaType: 'Movie';
  tmdbId?: number | null;
  releaseYear?: number | null;
};

export type Anime = MediaItem & {
  mediaType: 'Anime';
  jikanMalId?: number | null;
  episodes?: number | null;
  favoriteEpisode?: string | null;
};

export type KDrama = MediaItem & {
  mediaType: 'KDrama';
  tmdbId?: number | null;
  releaseYear?: number | null;
  episodes?: number | null;
  favoriteEpisode?: string | null;
};

// --- Union Type ---
// A single type that can represent any media item in the library.
export type LibraryItem = Book | Movie | Anime | KDrama;

// --- Enums & Constants for Statuses ---
export const BOOK_STATUSES = ['Owned', 'Wishlist', 'Loaned', 'Completed'] as const;
export type BookStatus = (typeof BOOK_STATUSES)[number];

export const MOVIE_STATUSES = ['Owned', 'Wishlist', 'Watched'] as const;
export type MovieStatus = (typeof MOVIE_STATUSES)[number];

export const ANIME_STATUSES = ['Watching', 'Completed', 'On-Hold', 'Dropped', 'Plan to Watch'] as const;
export type AnimeStatus = (typeof ANIME_STATUSES)[number];

export const KDRAMA_STATUSES = ['Watching', 'Completed', 'On-Hold', 'Dropped', 'Plan to Watch'] as const;
export type KDramaStatus = (typeof KDRAMA_STATUSES)[number];


// --- Normalized Search Result Types ---
// These types are for data coming from external APIs before it's converted to a LibraryItem.

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
  mediaType: 'Anime';
  title: string;
  posterUrl: string | null;
  jikanMalId: number;
  episodes?: number | null;
  overview?: string | null;
  year?: number | null;
};

export type NormalizedKDrama = {
  mediaType: 'KDrama';
  title: string;
  posterUrl: string | null;
  tmdbId: number;
  episodes?: number | null;
  overview?: string | null;
  releaseYear?: number;
};

export type NormalizedMedia = NormalizedBook | NormalizedMovie | NormalizedAnime | NormalizedKDrama;
