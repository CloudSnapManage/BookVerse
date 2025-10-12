import axios from 'axios';
import type { NormalizedBook } from './types';

const OPEN_LIBRARY_API_URL = 'https://openlibrary.org';

// Type for the raw document from Open Library search results
interface OpenLibraryDoc {
  key: string;
  title: string;
  subtitle?: string;
  author_name?: string[];
  cover_i?: number;
  isbn?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number;
  publisher?: string[];
}

function normalizeBook(doc: OpenLibraryDoc): NormalizedBook {
  const workId = doc.key.replace('/works/', '');
  return {
    openLibraryId: workId,
    title: doc.title,
    subtitle: doc.subtitle,
    authors: doc.author_name || [],
    coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : null,
    isbn: doc.isbn || [],
    publishYear: doc.first_publish_year,
    pages: doc.number_of_pages_median,
    publisher: doc.publisher?.[0],
  };
}

export async function searchAndNormalizeBooks(query: string, limit = 10): Promise<NormalizedBook[]> {
  const response = await axios.get(`${OPEN_LIBRARY_API_URL}/search.json`, {
    params: { q: query, limit },
  });

  const docs: OpenLibraryDoc[] = response.data.docs || [];
  
  // Deduplicate results by work ID
  const uniqueDocs = Array.from(new Map(docs.map(doc => [doc.key, doc])).values());

  return uniqueDocs.map(normalizeBook);
}
