import { NextResponse } from 'next/server';
import { searchAndNormalizeBooks } from '@/lib/open-library';

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

    const books = await searchAndNormalizeBooks(query);

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error in book search API:', error);
    return NextResponse.json({ error: 'Failed to fetch book data.' }, { status: 500 });
  }
}
