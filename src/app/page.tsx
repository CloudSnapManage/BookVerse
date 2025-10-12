'use client';

import { Suspense, useState, useEffect } from 'react';
import type { Book } from '@prisma/client';
import { BookGrid } from '@/components/book-grid';
import { AddBookButton } from '@/components/add-book-button';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/header';
import type { User } from 'next-auth';
import { BookDetailsDialog } from '@/components/book-details-dialog';
import { TopLoader } from '@/components/top-loader';

const demoUser: User = {
  id: 'clx1v2q2y000012b1a51a1b1a',
  email: 'demo@bookverse.com',
  name: 'Demo User',
  image: null,
};

function BookListSkeleton() {
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

const LOCAL_STORAGE_KEY = 'bookverse-library';

export default function AppHomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Load books from localStorage on initial render
  useEffect(() => {
    try {
      // Simulate a small delay for the loading bar effect
      setTimeout(() => {
        const storedBooks = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedBooks) {
          setBooks(JSON.parse(storedBooks));
        }
        setLoading(false);
      }, 700);
    } catch (error) {
      console.error('Failed to parse books from localStorage', error);
      setBooks([]);
      setLoading(false);
    }
  }, []);

  // Save books to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(books));
      } catch (error) {
        console.error('Failed to save books to localStorage', error);
      }
    }
  }, [books, loading]);

  const handleBookAdded = (newBookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const newBook: Book = {
      ...newBookData,
      id: new Date().toISOString(), // Temporary unique ID
      userId: demoUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setBooks(prevBooks => [newBook, ...prevBooks]);
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
  };

  return (
    <>
      {loading && <TopLoader />}
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Header user={demoUser} onBookAdded={handleBookAdded} />
        <main className="flex-1">
          <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">My Library</h1>
              <AddBookButton onBookAdded={handleBookAdded}>Add Book</AddBookButton>
            </div>
            
            <div className="mt-8">
              <Suspense fallback={<BookListSkeleton />}>
                {loading ? <BookListSkeleton /> : <BookGrid books={books} onBookSelect={handleBookSelect} />}
              </Suspense>
            </div>

          </div>
        </main>
      </div>
      <BookDetailsDialog 
        book={selectedBook} 
        open={!!selectedBook} 
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedBook(null);
          }
        }}
        onBookUpdated={() => { /* This can be implemented later */ }}
      />
    </>
  );
}
