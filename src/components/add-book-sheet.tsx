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

export function AddBookSheet({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

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
          <AddBookForm onBookAdded={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
