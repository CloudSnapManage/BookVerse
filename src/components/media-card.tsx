import type { LibraryItem, Book, Movie, Anime, KDrama } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star } from 'lucide-react';

const defaultBookCover = PlaceHolderImages.find(img => img.id === 'default-book-cover');
const defaultMoviePoster = PlaceHolderImages.find(img => img.id === 'default-movie-poster') || defaultBookCover;
const defaultAnimePoster = PlaceHolderImages.find(img => img.id === 'default-anime-poster') || defaultBookCover;
const defaultKDramaPoster = PlaceHolderImages.find(img => img.id === 'default-kdrama-poster') || defaultMoviePoster;


function StarRating({ rating }: { rating: number | null | undefined }) {
    if (!rating) return null;
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground/30'}`} />
            ))}
        </div>
    );
}

type MediaCardProps = {
    media: LibraryItem;
    onSelect: (media: LibraryItem) => void;
}

export function MediaCard({ media, onSelect }: MediaCardProps) {
  const isBook = media.mediaType === 'Book';
  const isMovie = media.mediaType === 'Movie';
  const isAnime = media.mediaType === 'Anime';
  const isKDrama = media.mediaType === 'KDrama';

  const coverUrl = media.coverUrl;
  let defaultCover = defaultBookCover;
  if (isMovie) defaultCover = defaultMoviePoster;
  if (isAnime) defaultCover = defaultAnimePoster;
  if (isKDrama) defaultCover = defaultKDramaPoster;

  return (
    <div 
        className="group cursor-pointer"
        onClick={() => onSelect(media)}
    >
      <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="relative aspect-[2/3] w-full">
            <Image
              src={coverUrl || defaultCover?.imageUrl || ''}
              alt={`Cover of ${media.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
              data-ai-hint={!coverUrl ? defaultCover?.imageHint : ''}
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </div>
        </CardContent>
      </Card>
      <div className="pt-3">
        <h3 className="font-headline font-semibold text-base leading-tight truncate transition-colors group-hover:text-primary" title={media.title}>
            {media.title}
        </h3>
        {isBook && (
            <p className="text-sm text-muted-foreground truncate mt-0.5">
                {(media as Book).authors.join(', ')}
            </p>
        )}
        {(isMovie || isKDrama) && (media as Movie).releaseYear && (
             <p className="text-sm text-muted-foreground truncate mt-0.5">
                {(media as Movie).releaseYear}
            </p>
        )}
        {(isAnime) && (media as Anime).episodes && (
             <p className="text-sm text-muted-foreground truncate mt-0.5">
                {(media as Anime).episodes} episodes
            </p>
        )}
        <div className="mt-2 flex items-center justify-between">
            <Badge variant={media.status === 'Completed' || media.status === 'Watched' ? 'default' : 'secondary'}>{media.status}</Badge>
            <StarRating rating={media.rating} />
        </div>
      </div>
    </div>
  );
}
