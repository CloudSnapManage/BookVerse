import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import { BookGrid } from '@/components/book-grid';
import { AddBookButton } from '@/components/add-book-button';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/header';
import type { User } from 'next-auth';

const demoUser: User = {
  id: 'demo-user-id',
  email: 'demo@bookverse.com',
  name: 'Demo User',
  image: null,
};

async function BookList() {
  // Since there is no db access, we will return an empty array.
  // When the DB issue is resolved, this will fetch the user's books.
  const books = await Promise.resolve([]);
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
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header user={demoUser} />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-between">
            <h1 className="font-headline text-3xl font-bold">My Library</h1>
          </div>
          
          <div className="mt-8">
            <Suspense fallback={<BookListSkeleton />}>
              <BookList />
            </Suspense>
          </div>

          <AddBookButton />
        </div>
      </main>
    </div>
  );
}
