'use client';

import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Loader2, Search, Book, Film, Tv } from 'lucide-react';
import type { NormalizedMedia, MediaType } from '@/lib/types';
import { Button } from './ui/button';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function SearchMedia({ 
    onMediaSelect, 
    onSearchTypeChange 
}: { 
    onMediaSelect: (media: NormalizedMedia) => void,
    onSearchTypeChange: (type: MediaType) => void,
}) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchType, setSearchType] = useState<MediaType>('Book');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onSearchTypeChange(searchType);
  }, [searchType, onSearchTypeChange]);

  const apiUrl =
    debouncedQuery.length >= 3
      ? searchType === 'Book'
        ? `/api/search/books?q=${encodeURIComponent(debouncedQuery)}`
        : searchType === 'Movie'
        ? `/api/search/movies?q=${encodeURIComponent(debouncedQuery)}`
        : `/api/search/anime?q=${encodeURIComponent(debouncedQuery)}`
      : null;

  const { data: results, error, isLoading } = useSWR<NormalizedMedia[]>(apiUrl, fetcher);

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

  const handleSelect = (media: NormalizedMedia) => {
    onMediaSelect(media);
    setQuery('');
    setIsFocused(false);
  };

  const getMediaId = (media: NormalizedMedia) => {
    if (media.mediaType === 'Book') return media.openLibraryId;
    if (media.mediaType === 'Movie') return media.tmdbId;
    if (media.mediaType === 'Anime') return media.jikanMalId;
    return new Date().toISOString();
  }

  return (
    <div className="relative" ref={searchContainerRef}>
        <div className="flex gap-2 mb-2">
            <Button 
                variant={searchType === 'Book' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setSearchType('Book')}
                className='h-8'
            >
                <Book className="mr-2 h-4 w-4" /> Books
            </Button>
            <Button 
                variant={searchType === 'Movie' ? 'secondary' : 'ghost'}
                size="sm" 
                onClick={() => setSearchType('Movie')}
                className='h-8'
            >
                <Film className="mr-2 h-4 w-4" /> Movies
            </Button>
            <Button 
                variant={searchType === 'Anime' ? 'secondary' : 'ghost'}
                size="sm" 
                onClick={() => setSearchType('Anime')}
                className='h-8'
            >
                <Tv className="mr-2 h-4 w-4" /> Anime
            </Button>
        </div>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder={`Search for a ${searchType.toLowerCase()}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="pl-11 h-11 text-base"
        />
        {isLoading && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />}
      </div>
      {isFocused && (query.length > 0) && (
        <Card className="absolute z-10 mt-2 w-full max-h-96 overflow-y-auto shadow-lg">
          {debouncedQuery.length < 3 ? (
             <div className="p-4 text-sm text-muted-foreground">Keep typing to see results...</div>
          ) : isLoading && !results ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : error ? (
            <div className="p-4 text-sm text-destructive">Failed to load results.</div>
          ) : results && results.length > 0 ? (
            <ul>
              {results.map((media) => (
                <li key={getMediaId(media)}>
                  <button type="button" onClick={() => handleSelect(media)} className="w-full text-left p-3 hover:bg-accent transition-colors flex items-start gap-4">
                    <div className="relative h-20 w-14 flex-shrink-0 rounded-sm overflow-hidden bg-muted">
                        <Image
                            src={(media.mediaType === 'Book' ? media.coverUrl : media.posterUrl) || `https://picsum.photos/seed/${getMediaId(media)}/100/150`}
                            alt={`Cover of ${media.title}`}
                            fill
                            className="object-cover"
                            sizes="56px"
                        />
                    </div>
                    <div>
                      <p className="font-semibold leading-snug">{media.title}</p>
                      {media.mediaType === 'Book' && (
                          <>
                            <p className="text-sm text-muted-foreground">{media.authors.join(', ')}</p>
                            {media.publishYear && <p className="text-xs text-muted-foreground mt-1">{media.publishYear}</p>}
                          </>
                      )}
                      {media.mediaType === 'Movie' && (
                          <p className="text-sm text-muted-foreground">{media.releaseYear}</p>
                      )}
                       {media.mediaType === 'Anime' && (
                          <p className="text-sm text-muted-foreground">{media.episodes} episodes</p>
                      )}
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
