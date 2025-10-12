import { Plus } from 'lucide-react';
import { AddBookSheet } from './add-book-sheet';
import { Button } from './ui/button';
import type { Book } from '@prisma/client';

type AddBookButtonProps = {
    onBookAdded: (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
    children?: React.ReactNode;
};

export function AddBookButton({ onBookAdded, children }: AddBookButtonProps) {
  return (
    <AddBookSheet onBookAdded={onBookAdded}>
        {children ? (
            <Button>
                <Plus className="mr-2 h-4 w-4" />
                {children}
            </Button>
        ) : (
            <Button
                className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
                aria-label="Add new book"
            >
                <Plus className="h-8 w-8" />
            </Button>
        )}
    </AddBookSheet>
  );
}
