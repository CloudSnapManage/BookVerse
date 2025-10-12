import type { Book, Movie } from '@prisma/client';
import { MediaCard } from './media-card';
import { BookHeart, Clapperboard } from 'lucide-react';

type MediaGridProps = {
    media: (Book | Movie)[];
    onMediaSelect: (item: Book | Movie) => void;
}

export function MediaGrid({ media, onMediaSelect }: MediaGridProps) {
  if (media.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center h-96 animate-in fade-in-50">
            <div className="flex items-center text-muted-foreground/50">
                <BookHeart className="mx-auto h-16 w-16" strokeWidth={1.5} />
                <Clapperboard className="mx-auto h-16 w-16" strokeWidth={1.5} />
            </div>
            <h3 className="mt-6 font-headline text-2xl font-semibold">Your library is empty</h3>
            <p className="mt-2 text-base text-muted-foreground">Add your first book or movie to get started.</p>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
