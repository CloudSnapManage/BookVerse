import { Plus } from 'lucide-react';
import { AddMediaSheet } from './add-media-sheet';
import { Button } from './ui/button';
import type { Book, Movie } from '@prisma/client';

type AddMediaButtonProps = {
    onMediaAdded: (mediaData: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'userId'> | Omit<Movie, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
    children?: React.ReactNode;
};

export function AddMediaButton({ onMediaAdded, children }: AddMediaButtonProps) {
  return (
    <AddMediaSheet onMediaAdded={onMediaAdded} onMediaUpdated={() => {}}>
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        {children || 'Add Media'}
      </Button>
    </AddMediaSheet>
  );
}
