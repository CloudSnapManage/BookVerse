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
import type { Book, Movie, Anime, KDrama } from '@/lib/types';

type AddBookSheetProps = {
    children?: React.ReactNode;
    onMediaAdded: (mediaData: any) => void;
    onMediaUpdated: (updatedMedia: any) => void;
    mediaToEdit?: Book | Movie | Anime | KDrama | null;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

export function AddBookSheet({ 
  children, 
  onMediaAdded, 
  onMediaUpdated,
  mediaToEdit,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: AddBookSheetProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;

    const open = isControlled ? controlledOpen : internalOpen;
    const setOpen = isControlled ? setControlledOpen : setInternalOpen;
    const isEditMode = !!mediaToEdit;

    const handleFormSubmit = (
        data: any, 
        mediaId?: string
    ) => {
        if (mediaId && mediaToEdit) {
            onMediaUpdated({ ...mediaToEdit, ...data });
        } else {
            onMediaAdded(data);
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
          <SheetTitle className="font-headline text-2xl">{isEditMode ? 'Edit Media' : 'Add New Media'}</SheetTitle>
          <SheetDescription>
            {isEditMode 
              ? 'Update the details of this item in your library.' 
              : 'Search for a book, movie, anime, or drama to auto-fill details, or enter them manually.'
            }
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <AddBookForm onFormSubmit={handleFormSubmit} mediaToEdit={mediaToEdit} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
