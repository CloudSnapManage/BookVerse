import axios from 'axios';
import type { NormalizedMovie, NormalizedKDrama } from './types';

const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;

// Type for the raw movie result from TMDb search
interface TmdbMovieResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
}

interface TmdbTvResult {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  overview: string;
  origin_country: string[];
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

function normalizeTvShow(show: TmdbTvResult): NormalizedKDrama {
    const releaseYear = show.first_air_date ? new Date(show.first_air_date).getFullYear() : undefined;

    return {
        mediaType: 'KDrama',
        tmdbId: show.id,
        title: show.name,
        posterUrl: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : null,
        releaseYear,
        overview: show.overview,
    };
}

export async function searchMovies(query: string, limit = 10): Promise<NormalizedMovie[]> {
  if (!TMDB_TOKEN) {
    console.warn('TMDb Read Access Token is not configured. Please set the TMDB_READ_ACCESS_TOKEN environment variable. Returning empty results.');
    return [];
  }
    
  const response = await axios.get(`${TMDB_API_URL}/search/movie`, {
    params: {
      query: query,
      include_adult: false,
      language: 'en-US',
      page: 1,
    },
    headers: {
      'Authorization': `Bearer ${TMDB_TOKEN}`,
      'Content-Type': 'application/json;charset=utf-8'
    }
  });

  const results: TmdbMovieResult[] = response.data.results || [];
  const normalizedMovies = results.slice(0, limit).map(normalizeMovie);

  return normalizedMovies;
}

export async function searchTvShows(query: string, limit = 10): Promise<NormalizedKDrama[]> {
    if (!TMDB_TOKEN) {
        console.warn('TMDb Read Access Token is not configured. Please set the TMDB_READ_ACCESS_TOKEN environment variable. Returning empty results.');
        return [];
    }

    const response = await axios.get(`${TMDB_API_URL}/search/tv`, {
        params: {
            query: query,
            include_adult: false,
            language: 'en-US',
            page: 1,
        },
        headers: {
            'Authorization': `Bearer ${TMDB_TOKEN}`,
            'Content-Type': 'application/json;charset=utf-8'
        }
    });

    const results: TmdbTvResult[] = response.data.results || [];
    
    // Prioritize shows from Korea (KR) or China (CN)
    const sortedResults = results.sort((a, b) => {
        const aIsDrama = a.origin_country.includes('KR') || a.origin_country.includes('CN');
        const bIsDrama = b.origin_country.includes('KR') || b.origin_country.includes('CN');
        if (aIsDrama && !bIsDrama) return -1;
        if (!aIsDrama && bIsDrama) return 1;
        return 0;
    });
    
    const normalizedShows = sortedResults.slice(0, limit).map(normalizeTvShow);

    return normalizedShows;
}
