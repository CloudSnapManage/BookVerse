'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import type { Book } from '@prisma/client';
import { BookGrid } from '@/components/book-grid';
import { AddBookButton } from '@/components/add-book-button';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/header';
import type { User } from 'next-auth';
import { BookDetailsDialog } from '@/components/book-details-dialog';
import { TopLoader } from '@/components/top-loader';
import { LibraryControls } from '@/components/library-controls';
import type { BookStatus } from '@/lib/types';
import type { SortOption } from '@/components/library-controls';
import { AddBookSheet } from '@/components/add-book-sheet';

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
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [filter, setFilter] = useState<BookStatus | 'All'>('All');
  const [sort, setSort] = useState<SortOption>({ key: 'createdAt', direction: 'desc' });

  // Load books from localStorage on initial render
  useEffect(() => {
    try {
      setTimeout(() => {
        const storedBooks = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedBooks) {
          // Make sure dates are parsed correctly
          const parsedBooks = JSON.parse(storedBooks).map((book: any) => ({
            ...book,
            createdAt: new Date(book.createdAt),
            updatedAt: new Date(book.updatedAt),
          }));
          setBooks(parsedBooks);
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
  
  const handleBookUpdated = (updatedBook: Book) => {
    setBooks(prevBooks =>
      prevBooks.map(book => (book.id === updatedBook.id ? { ...updatedBook, updatedAt: new Date() } : book))
    );
    setEditingBook(null); // Close edit sheet
    setSelectedBook(null); // Close details dialog
  };

  const handleBookDeleted = (bookId: string) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
    setSelectedBook(null);
  }

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
  };
  
  const handleEditRequest = (book: Book) => {
    setSelectedBook(null);
    setEditingBook(book);
  };

  const filteredAndSortedBooks = useMemo(() => {
    let filtered = books;
    if (filter !== 'All') {
      filtered = books.filter(book => book.status === filter);
    }

    return [...filtered].sort((a, b) => {
      const { key, direction } = sort;
      
      let valA: any, valB: any;

      if (key === 'title' || key === 'status') {
        valA = a[key].toLowerCase();
        valB = b[key].toLowerCase();
      } else if (key === 'authors') {
        valA = a.authors[0]?.toLowerCase() || '';
        valB = b.authors[0]?.toLowerCase() || '';
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
  }, [books, filter, sort]);


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
                <AddBookButton onBookAdded={handleBookAdded} />
              </div>
            </div>
            
            <div className="mt-8">
              <Suspense fallback={<BookListSkeleton />}>
                {loading ? <BookListSkeleton /> : <BookGrid books={filteredAndSortedBooks} onBookSelect={handleBookSelect} />}
              </Suspense>
            </div>

          </div>
        </main>
      </div>

      <AddBookSheet 
        open={!!editingBook}
        onOpenChange={(isOpen) => !isOpen && setEditingBook(null)}
        bookToEdit={editingBook}
        onBookAdded={handleBookAdded}
        onBookUpdated={handleBookUpdated}
      />
      
      <BookDetailsDialog 
        book={selectedBook} 
        open={!!selectedBook} 
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedBook(null);
          }
        }}
        onEdit={handleEditRequest}
        onDelete={handleBookDeleted}
      />
    </>
  );
}
