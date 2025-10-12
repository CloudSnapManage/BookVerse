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
import { useState, useEffect } from 'react';
import type { Book } from '@prisma/client';

type AddBookSheetProps = {
    children?: React.ReactNode;
    onBookAdded: (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
    onBookUpdated: (updatedBook: Book) => void;
    bookToEdit?: Book | null;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

export function AddBookSheet({ 
  children, 
  onBookAdded, 
  onBookUpdated,
  bookToEdit,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: AddBookSheetProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;

    const open = isControlled ? controlledOpen : internalOpen;
    const setOpen = isControlled ? setControlledOpen : setInternalOpen;
    const isEditMode = !!bookToEdit;

    const handleFormSubmit = (
        data: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'userId'>, 
        bookId?: string
    ) => {
        if (bookId && bookToEdit) {
            onBookUpdated({ ...bookToEdit, ...data });
        } else {
            onBookAdded(data);
        }
        setOpen(false);
    }

    // Reset form state when switching between add/edit
    useEffect(() => {
        if (open && !isEditMode) {
            // Potentially clear form if needed, handled by form's own useEffect
        }
    }, [open, isEditMode]);

  const Trigger = children ? <SheetTrigger asChild>{children}</SheetTrigger> : null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {Trigger}
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="font-headline text-2xl">{isEditMode ? 'Edit Book' : 'Add a New Book'}</SheetTitle>
          <SheetDescription>
            {isEditMode 
              ? 'Update the details of this book in your library.' 
              : 'Search for a book to auto-fill details, or enter them manually.'
            }
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <AddBookForm onFormSubmit={handleFormSubmit} bookToEdit={bookToEdit} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
