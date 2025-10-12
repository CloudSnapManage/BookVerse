import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { BookGrid } from '@/components/book-grid';
import { AddBookButton } from '@/components/add-book-button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';

async function BookList() {
  const session = await auth();
  const books = await prisma.book.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: 'desc' },
  });
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

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">My Library</h1>
      </div>
      
      {/* TODO: Add filters here */}
      <div className="mt-8">
        <Suspense fallback={<BookListSkeleton />}>
          <BookList />
        </Suspense>
      </div>

      <AddBookButton />
    </div>
  );
}
