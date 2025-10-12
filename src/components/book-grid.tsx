import type { Book } from '@prisma/client';
import { BookCard } from './book-card';
import { BookHeart } from 'lucide-react';

type BookGridProps = {
    books: Book[];
    onBookSelect: (book: Book) => void;
}

export function BookGrid({ books, onBookSelect }: BookGridProps) {
  if (books.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center h-96">
            <BookHeart className="mx-auto h-16 w-16 text-muted-foreground/50" strokeWidth={1.5} />
            <h3 className="mt-6 font-headline text-2xl font-semibold">Your library is empty</h3>
            <p className="mt-2 text-base text-muted-foreground">Add your first book to get started.</p>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onSelect={onBookSelect} />
      ))}
    </div>
  );
}
