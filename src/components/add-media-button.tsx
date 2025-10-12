import { Plus } from 'lucide-react';
import { AddBookSheet } from './add-book-sheet';
import { Button } from './ui/button';
import type { Book, Movie, Anime, KDrama } from '@/lib/types';

type AddMediaButtonProps = {
    onMediaAdded: (mediaData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'> | Omit<Movie, 'id' | 'createdAt' | 'updatedAt'> | Omit<Anime, 'id' | 'createdAt' | 'updatedAt'> | Omit<KDrama, 'id' | 'createdAt' | 'updatedAt'>) => void;
    children?: React.ReactNode;
};

export function AddMediaButton({ onMediaAdded, children }: AddMediaButtonProps) {
  return (
    <AddBookSheet onMediaAdded={onMediaAdded} onMediaUpdated={() => {}}>
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        {children || 'Add Media'}
      </Button>
    </AddBookSheet>
  );
}
