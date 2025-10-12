import { NextResponse } from 'next/server';
import { searchTvShows } from '@/lib/tmdb';

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

    const dramas = await searchTvShows(query);

    return NextResponse.json(dramas);
  } catch (error) {
    console.error('Error in TV show search API:', error);
    return NextResponse.json({ error: 'Failed to fetch TV show data.' }, { status: 500 });
  }
}
