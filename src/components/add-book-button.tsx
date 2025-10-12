import { Plus } from 'lucide-react';
import { AddBookSheet } from './add-book-sheet';
import { Button } from './ui/button';

export function AddBookButton() {
  return (
    <AddBookSheet>
        <Button
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
            aria-label="Add new book"
        >
            <Plus className="h-8 w-8" />
        </Button>
    </AddBookSheet>
  );
}
