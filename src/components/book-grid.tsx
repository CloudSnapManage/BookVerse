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
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
            <BookHeart className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-headline text-xl font-semibold">Your library is empty</h3>
            <p className="mt-2 text-sm text-muted-foreground">Add your first book to get started.</p>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onSelect={onBookSelect} />
      ))}
    </div>
  );
}
