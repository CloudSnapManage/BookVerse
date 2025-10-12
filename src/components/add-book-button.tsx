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
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        {children || 'Add Book'}
      </Button>
    </AddBookSheet>
  );
}
