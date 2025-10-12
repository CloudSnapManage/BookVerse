import type { LibraryItem } from '@/lib/types';
import { MediaCard } from './media-card';
import { BookHeart, Clapperboard, Drama, Tv } from 'lucide-react';

type MediaGridProps = {
    media: LibraryItem[];
    onMediaSelect: (item: LibraryItem) => void;
}

export function MediaGrid({ media, onMediaSelect }: MediaGridProps) {
  if (media.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center h-96 animate-in fade-in-50">
            <div className="flex items-center text-muted-foreground/50 gap-4">
                <BookHeart className="mx-auto h-12 w-12 md:h-16 md:w-16" strokeWidth={1.5} />
                <Clapperboard className="mx-auto h-12 w-12 md:h-16 md:w-16" strokeWidth={1.5} />
                <Tv className="mx-auto h-12 w-12 md:h-16 md:w-16" strokeWidth={1.5} />
                <Drama className="mx-auto h-12 w-12 md:h-16 md:w-16" strokeWidth={1.5} />
            </div>
            <h3 className="mt-6 font-headline text-xl md:text-2xl font-semibold">Your library is empty</h3>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">Add your first book, movie, anime, or drama to get started.</p>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {media.map((item, i) => (
        <div 
            key={item.id} 
            className="animate-in fade-in-50"
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'backwards' }}
        >
            <MediaCard media={item} onSelect={onMediaSelect} />
        </div>
      ))}
    </div>
  );
}
