import axios from 'axios';
import type { NormalizedAnime } from './types';

const JIKAN_API_URL = 'https://api.jikan.moe/v4';

interface JikanAnimeResult {
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
      webp: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
    };
    title: string;
    title_english: string;
    title_japanese: string;
    episodes: number | null;
    status: string;
    synopsis: string | null;
    year: number | null;
}

function normalizeAnime(anime: JikanAnimeResult): NormalizedAnime {
  return {
    mediaType: 'Anime',
    jikanMalId: anime.mal_id,
    title: anime.title_english || anime.title,
    posterUrl: anime.images.jpg.large_image_url || anime.images.jpg.image_url,
    episodes: anime.episodes ?? undefined,
    overview: anime.synopsis,
    year: anime.year,
  };
}

export async function searchAnime(query: string, limit = 10): Promise<NormalizedAnime[]> {
  const response = await axios.get(`${JIKAN_API_URL}/anime`, {
    params: {
      q: query,
      limit,
      sfw: true, // Safe for work filter
    },
  });

  const results: JikanAnimeResult[] = response.data.data || [];
  const normalizedAnime = results.map(normalizeAnime);

  return normalizedAnime;
}
