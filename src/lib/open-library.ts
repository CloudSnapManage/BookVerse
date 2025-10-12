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
  by_statement?: string; 
  edition_key?: string[];
}

// Type for the detailed Work record from Open Library
interface OpenLibraryWork {
  description?: string | { type: string; value: string };
  // Add other work fields if needed in the future
}


function normalizeBook(doc: OpenLibraryDoc): Omit<NormalizedBook, 'description'> {
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

export async function searchBooks(query: string, limit = 10): Promise<Omit<NormalizedBook, 'description'>[]> {
  const response = await axios.get(`${OPEN_LIBRARY_API_URL}/search.json`, {
    params: { 
      q: query, 
      limit,
      fields: 'key,title,subtitle,author_name,cover_i,isbn,first_publish_year,number_of_pages_median,publisher,by_statement,edition_key'
    },
  });

  const docs: OpenLibraryDoc[] = response.data.docs || [];
  
  // Deduplicate results by work ID
  const uniqueDocs = Array.from(new Map(docs.map(doc => [doc.key, doc])).values());
  const normalizedBooks = uniqueDocs.map(normalizeBook);

  return normalizedBooks;
}

export async function getBookDescription(workId: string): Promise<string | undefined> {
  if (!workId) return undefined;
  
  try {
    const response = await axios.get<OpenLibraryWork>(`${OPEN_LIBRARY_API_URL}/works/${workId}.json`);
    const workData = response.data;
    
    if (!workData.description) return undefined;

    // The description can be a string or an object with a 'value' property
    return typeof workData.description === 'string' ? workData.description : workData.description.value;

  } catch (error) {
    console.error(`Failed to fetch description for workId ${workId}:`, error);
    return undefined;
  }
}