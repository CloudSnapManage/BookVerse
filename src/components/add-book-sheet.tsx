'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { AddBookForm } from './add-book-form';
import { useState } from 'react';
import type { Book } from '@prisma/client';

type AddBookSheetProps = {
    children: React.ReactNode;
    onBookAdded: (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
};

export function AddBookSheet({ children, onBookAdded }: AddBookSheetProps) {
    const [open, setOpen] = useState(false);

    const handleBookAdded = (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
        onBookAdded(bookData);
        setOpen(false);
    }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-headline">Add a New Book</SheetTitle>
          <SheetDescription>
            Search for a book to auto-fill details, or enter them manually.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <AddBookForm onBookAdded={handleBookAdded} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
