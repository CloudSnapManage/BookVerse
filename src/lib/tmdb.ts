import axios from 'axios';
import type { NormalizedMovie } from './types';

const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Type for the raw movie result from TMDb search
interface TmdbMovieResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
}

function normalizeMovie(movie: TmdbMovieResult): NormalizedMovie {
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : undefined;
  
  return {
    mediaType: 'Movie',
    tmdbId: movie.id,
    title: movie.title,
    posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    releaseYear,
    overview: movie.overview,
  };
}

export async function searchMovies(query: string, limit = 10): Promise<NormalizedMovie[]> {
  if (!TMDB_API_KEY) {
    console.warn('TMDb API key is not configured. Please set the TMDB_API_KEY environment variable. Returning empty results.');
    return [];
  }
    
  const response = await axios.get(`${TMDB_API_URL}/search/movie`, {
    params: {
      api_key: TMDB_API_KEY,
      query: query,
      include_adult: false,
      language: 'en-US',
      page: 1,
    },
  });

  const results: TmdbMovieResult[] = response.data.results || [];
  const normalizedMovies = results.slice(0, limit).map(normalizeMovie);

  return normalizedMovies;
}
