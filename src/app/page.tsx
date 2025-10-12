'use client';

import { Suspense, useState, useEffect } from 'react';
import type { Book } from '@prisma/client';
import { BookGrid } from '@/components/book-grid';
import { AddBookButton } from '@/components/add-book-button';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/header';
import type { User } from 'next-auth';

const demoUser: User = {
  id: 'clx1v2q2y000012b1a51a1b1a',
  email: 'demo@bookverse.com',
  name: 'Demo User',
  image: null,
};

function BookList({ books }: { books: Book[] }) {
  return <BookGrid books={books} />;
}

function BookListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
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

export default function AppHomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching books
  useEffect(() => {
    // In a real app, you'd fetch this from an API
    setBooks([]);
    setLoading(false);
  }, []);

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


  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header user={demoUser} onBookAdded={handleBookAdded} />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-between">
            <h1 className="font-headline text-3xl font-bold">My Library</h1>
          </div>
          
          <div className="mt-8">
            <Suspense fallback={<BookListSkeleton />}>
              {loading ? <BookListSkeleton /> : <BookGrid books={books} />}
            </Suspense>
          </div>

        </div>
      </main>
    </div>
  );
}
