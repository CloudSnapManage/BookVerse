import { NextResponse } from 'next/server';
import { searchAnime } from '@/lib/jikan';

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

    const anime = await searchAnime(query);

    return NextResponse.json(anime);
  } catch (error) {
    console.error('Error in anime search API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: 'Failed to fetch anime data.', details: errorMessage }, { status: 500 });
  }
}
