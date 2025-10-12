'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import type { Book, Movie } from '@prisma/client';
import { MediaGrid } from '@/components/media-grid';
import { AddMediaButton } from '@/components/add-media-button';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/header';
import type { User } from 'next-auth';
import { MediaDetailsDialog } from '@/components/media-details-dialog';
import { TopLoader } from '@/components/top-loader';
import { LibraryControls } from '@/components/library-controls';
import type { BookStatus, MovieStatus } from '@/lib/types';
import type { SortOption } from '@/components/library-controls';
import { AddMediaSheet } from '@/components/add-media-sheet';

const demoUser: User = {
  id: 'clx1v2q2y000012b1a51a1b1a',
  email: 'demo@bookverse.com',
  name: 'Demo User',
  image: null,
};

function MediaListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

const LOCAL_STORAGE_KEY_BOOKS = 'bookverse-library';
const LOCAL_STORAGE_KEY_MOVIES = 'movieverse-library';


export default function AppHomePage() {
  const [media, setMedia] = useState<(Book | Movie)[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<Book | Movie | null>(null);
  const [editingMedia, setEditingMedia] = useState<Book | Movie | null>(null);

  const [filter, setFilter] = useState<BookStatus | MovieStatus | 'All'>('All');
  const [sort, setSort] = useState<SortOption>({ key: 'createdAt', direction: 'desc' });

  // Load items from localStorage on initial render
  useEffect(() => {
    try {
      setTimeout(() => {
        const storedBooks = localStorage.getItem(LOCAL_STORAGE_KEY_BOOKS);
        const storedMovies = localStorage.getItem(LOCAL_STORAGE_KEY_MOVIES);
        
        let allMedia: (Book | Movie)[] = [];

        if (storedBooks) {
          const parsedBooks = JSON.parse(storedBooks).map((item: any) => ({
            ...item,
            mediaType: 'Book',
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }));
          allMedia = allMedia.concat(parsedBooks);
        }
        if (storedMovies) {
            const parsedMovies = JSON.parse(storedMovies).map((item: any) => ({
                ...item,
                mediaType: 'Movie',
                createdAt: new Date(item.createdAt),
                updatedAt: new Date(item.updatedAt),
            }));
            allMedia = allMedia.concat(parsedMovies);
        }
        setMedia(allMedia);
        setLoading(false);
      }, 700);
    } catch (error) {
      console.error('Failed to parse items from localStorage', error);
      setMedia([]);
      setLoading(false);
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        const books = media.filter(item => item.mediaType === 'Book');
        const movies = media.filter(item => item.mediaType === 'Movie');
        localStorage.setItem(LOCAL_STORAGE_KEY_BOOKS, JSON.stringify(books));
        localStorage.setItem(LOCAL_STORAGE_KEY_MOVIES, JSON.stringify(movies));
      } catch (error) {
        console.error('Failed to save items to localStorage', error);
      }
    }
  }, [media, loading]);

  const handleMediaAdded = (newMediaData: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'userId'> | Omit<Movie, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const newItem = {
      ...newMediaData,
      id: new Date().toISOString(), // Temporary unique ID
      userId: demoUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMedia(prevMedia => [newItem, ...prevMedia]);
  };
  
  const handleMediaUpdated = (updatedMedia: Book | Movie) => {
    setMedia(prevMedia =>
        prevMedia.map(item => (item.id === updatedMedia.id ? { ...updatedMedia, updatedAt: new Date() } : item))
    );
    setEditingMedia(null); // Close edit sheet
    setSelectedMedia(null); // Close details dialog
  };

  const handleMediaDeleted = (mediaId: string) => {
    setMedia(prevMedia => prevMedia.filter(item => item.id !== mediaId));
    setSelectedMedia(null);
  }

  const handleMediaSelect = (item: Book | Movie) => {
    setSelectedMedia(item);
  };
  
  const handleEditRequest = (item: Book | Movie) => {
    setSelectedMedia(null);
    setEditingMedia(item);
  };

  const filteredAndSortedMedia = useMemo(() => {
    let filtered = media;
    if (filter !== 'All') {
      filtered = media.filter(item => item.status === filter);
    }

    return [...filtered].sort((a, b) => {
      const { key, direction } = sort;
      
      let valA: any, valB: any;

      if (key === 'title' || key === 'status') {
        valA = a[key].toLowerCase();
        valB = b[key].toLowerCase();
      } else if (key === 'authors' && a.mediaType === 'Book' && b.mediaType === 'Book') {
        valA = (a as Book).authors[0]?.toLowerCase() || '';
        valB = (b as Book).authors[0]?.toLowerCase() || '';
      } else {
        valA = a[key];
        valB = b[key];
      }
      
      // Handle nulls for rating and dates
      if (valA === null || valA === undefined) valA = direction === 'asc' ? Infinity : -Infinity;
      if (valB === null || valB === undefined) valB = direction === 'asc' ? Infinity : -Infinity;


      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [media, filter, sort]);


  return (
    <>
      {loading && <TopLoader />}
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Header user={demoUser} />
        <main className="flex-1">
          <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">My Library</h1>
              <div className="flex items-center gap-2">
                <LibraryControls 
                  filter={filter} 
                  onFilterChange={setFilter}
                  sort={sort}
                  onSortChange={setSort}
                />
                <AddMediaButton onMediaAdded={handleMediaAdded} />
              </div>
            </div>
            
            <div className="mt-8">
              <Suspense fallback={<MediaListSkeleton />}>
                {loading ? <MediaListSkeleton /> : <MediaGrid media={filteredAndSortedMedia} onMediaSelect={handleMediaSelect} />}
              </Suspense>
            </div>

          </div>
        </main>
      </div>

      <AddMediaSheet 
        open={!!editingMedia}
        onOpenChange={(isOpen) => !isOpen && setEditingMedia(null)}
        mediaToEdit={editingMedia}
        onMediaAdded={handleMediaAdded}
        onMediaUpdated={handleMediaUpdated}
      />
      
      <MediaDetailsDialog 
        media={selectedMedia} 
        open={!!selectedMedia} 
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedMedia(null);
          }
        }}
        onEdit={handleEditRequest}
        onDelete={handleMediaDeleted}
      />
    </>
  );
}
