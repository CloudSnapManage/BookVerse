import { NextResponse } from 'next/server';
import { searchMovies } from '@/lib/tmdb';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 3) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required and must be at least 3 characters long.' },
        { status: 400 }
      );
    }

    const movies = await searchMovies(query);

    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error in movie search API:', error);
    return NextResponse.json({ error: 'Failed to fetch movie data.' }, { status: 500 });
  }
}
