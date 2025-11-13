'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Loader2, Search, Book, Film, Tv, Drama, AlertTriangle } from 'lucide-react';
import type { NormalizedMedia, MediaType } from '@/lib/types';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { searchBooks } from '@/lib/open-library';
import { searchAnime } from '@/lib/jikan';
import { searchMovies, searchTvShows } from '@/lib/tmdb';
import { useSettings } from '@/hooks/use-settings';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SettingsDialog } from './settings-dialog';


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
  const { isTmdbEnabled, tmdbApiKey, isSettingsLoaded } = useSettings();
  
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<NormalizedMedia[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onSearchTypeChange(searchType);
  }, [searchType, onSearchTypeChange]);

  const isTmdbSearch = searchType === 'Movie' || searchType === 'KDrama';

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length < 3) {
        setResults([]);
        setError(null);
        return;
      }

      if (isTmdbSearch && (!isTmdbEnabled || !tmdbApiKey)) {
        setError("TMDb features are not enabled or an API key is missing.");
        setResults([]);
        return;
      }


      setError(null);
      startTransition(async () => {
        try {
          let searchResults: NormalizedMedia[] = [];
          switch (searchType) {
            case 'Book':
              searchResults = await searchBooks(debouncedQuery);
              break;
            case 'Anime':
              searchResults = await searchAnime(debouncedQuery);
              break;
            case 'Movie':
              if (tmdbApiKey) {
                searchResults = await searchMovies(debouncedQuery, 10, tmdbApiKey);
              }
              break;
            case 'KDrama':
               if (tmdbApiKey) {
                searchResults = await searchTvShows(debouncedQuery, 10, tmdbApiKey);
              }
              break;
          }
          setResults(searchResults);
        } catch (e: any) {
            console.error(`Search failed for ${searchType}:`, e);
            if (e.message.includes('401')) {
                setError('Invalid TMDb API Key. Please check your key in the settings.');
            } else if (e.message.includes('not provided')) {
                setError('TMDb API Key is not provided. Please add it in settings.');
            } else {
                setError('Failed to fetch results. Please try again later.');
            }
            setResults([]);
        }
      });
    };

    if (isSettingsLoaded) {
      performSearch();
    }
  }, [debouncedQuery, searchType, isTmdbEnabled, tmdbApiKey, isSettingsLoaded, isTmdbSearch]);


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
    if (media.mediaType === 'KDrama') return media.tmdbId;
    return new Date().toISOString();
  }

  const showTmdbAlert = isSettingsLoaded && isTmdbSearch && !isTmdbEnabled;

  return (
    <div className="relative" ref={searchContainerRef}>
        <Tabs value={searchType} onValueChange={(value) => setSearchType(value as MediaType)} className="mb-2">
            <TabsList>
                <TabsTrigger value="Book"><Book className="mr-2 h-4 w-4" />Books</TabsTrigger>
                <TabsTrigger value="Anime"><Tv className="mr-2 h-4 w-4" />Anime</TabsTrigger>
                <TabsTrigger value="Movie"><Film className="mr-2 h-4 w-4" />Movies</TabsTrigger>
                <TabsTrigger value="KDrama"><Drama className="mr-2 h-4 w-4" />K-Drama</TabsTrigger>
            </TabsList>
        </Tabs>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder={`Search for a ${searchType.toLowerCase()}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="pl-11 h-11 text-base"
          disabled={showTmdbAlert}
        />
        {isPending && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />}
      </div>
      
      {showTmdbAlert && (
         <Alert className="mt-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Feature Disabled</AlertTitle>
            <AlertDescription className='flex items-center justify-between'>
              <span>Enable Movie & K-Drama search in the settings.</span>
              <SettingsDialog>
                 <Button variant="outline" size="sm">Settings</Button>
              </SettingsDialog>
            </AlertDescription>
        </Alert>
      )}

      {isFocused && (query.length > 0) && (
        <Card className="absolute z-10 mt-2 w-full max-h-96 overflow-y-auto shadow-lg">
          {debouncedQuery.length < 3 ? (
             <div className="p-4 text-sm text-muted-foreground">Keep typing to see results...</div>
          ) : isPending ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : error ? (
             <div className="p-4 text-sm text-destructive">{error}</div>
          ) : results && results.length > 0 ? (
            <ul>
              {results.map((media) => (
                <li key={getMediaId(media)}>
                  <button type="button" onClick={() => handleSelect(media)} className="w-full text-left p-3 hover:bg-accent transition-colors flex items-start gap-4">
                    <div className="relative h-20 w-14 flex-shrink-0 rounded-sm overflow-hidden bg-muted">
                        <Image
                            src={(media as any).posterUrl || (media as any).coverUrl || `https://picsum.photos/seed/${getMediaId(media)}/100/150`}
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
                      {(media.mediaType === 'Movie' || media.mediaType === 'KDrama') && (
                          <p className="text-sm text-muted-foreground">{(media as any).releaseYear}</p>
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
