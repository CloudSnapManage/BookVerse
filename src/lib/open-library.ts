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

interface OpenLibraryWork {
    description?: string | { type: string; value: string };
}

async function getWorkDescription(workId: string): Promise<string | null> {
    try {
        const response = await axios.get(`${OPEN_LIBRARY_API_URL}/works/${workId}.json`);
        const work: OpenLibraryWork = response.data;
        if (work.description) {
            if (typeof work.description === 'string') {
                return work.description;
            }
            if (typeof work.description === 'object' && work.description.value) {
                return work.description.value;
            }
        }
        return null;
    } catch (error) {
        console.error(`Failed to fetch description for work ${workId}`, error);
        return null;
    }
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

export async function searchAndNormalizeBooks(query: string, limit = 10): Promise<NormalizedBook[]> {
  const response = await axios.get(`${OPEN_LIBRARY_API_URL}/search.json`, {
    params: { q: query, limit },
  });

  const docs: OpenLibraryDoc[] = response.data.docs || [];
  
  // Deduplicate results by work ID
  const uniqueDocs = Array.from(new Map(docs.map(doc => [doc.key, doc])).values());
  const normalizedBooks = uniqueDocs.map(normalizeBook);

  const booksWithDescriptions = await Promise.all(
    normalizedBooks.map(async (book) => {
        const description = await getWorkDescription(book.openLibraryId);
        return { ...book, description };
    })
  );

  return booksWithDescriptions;
}
