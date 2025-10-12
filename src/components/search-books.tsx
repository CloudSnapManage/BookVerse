'use client';

import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Loader2, Search } from 'lucide-react';
import type { NormalizedBook } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function SearchBooks({ onBookSelect }: { onBookSelect: (book: NormalizedBook) => void }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { data: results, error, isLoading } = useSWR<NormalizedBook[]>(
    debouncedQuery.length >= 3 ? `/api/search/books?q=${encodeURIComponent(debouncedQuery)}` : null,
    fetcher
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (book: NormalizedBook) => {
    onBookSelect(book);
    setQuery('');
    setIsFocused(false);
  };

  return (
    <div className="relative" ref={searchContainerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for a book by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="pl-10"
        />
        {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />}
      </div>
      {isFocused && (query.length > 0) && (
        <Card className="absolute z-10 mt-2 w-full max-h-96 overflow-y-auto">
          {debouncedQuery.length < 3 ? (
             <div className="p-4 text-sm text-muted-foreground">Keep typing to see results...</div>
          ) : isLoading && !results ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : error ? (
            <div className="p-4 text-sm text-destructive">Failed to load results.</div>
          ) : results && results.length > 0 ? (
            <ul>
              {results.map((book) => (
                <li key={book.openLibraryId}>
                  <button type="button" onClick={() => handleSelect(book)} className="w-full text-left p-3 hover:bg-accent transition-colors flex items-start gap-4">
                    <div className="relative h-20 w-14 flex-shrink-0">
                        <Image
                            src={book.coverUrl || `https://picsum.photos/seed/${book.openLibraryId}/100/150`}
                            alt={`Cover of ${book.title}`}
                            fill
                            className="object-cover rounded-sm"
                            sizes="56px"
                        />
                    </div>
                    <div>
                      <p className="font-semibold">{book.title}</p>
                      <p className="text-sm text-muted-foreground">{book.authors.join(', ')}</p>
                      {book.publishYear && <p className="text-xs text-muted-foreground">{book.publishYear}</p>}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">No results found.</div>
          )}
        </Card>
      )}
    </div>
  );
}
