import type { Book } from '@prisma/client';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star } from 'lucide-react';

const defaultCover = PlaceHolderImages.find(img => img.id === 'default-book-cover');

function StarRating({ rating }: { rating: number | null | undefined }) {
    if (!rating) return null;
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-primary text-primary' : 'text-muted-foreground/50'}`} />
            ))}
        </div>
    );
}

type BookCardProps = {
    book: Book;
    onSelect: (book: Book) => void;
}

export function BookCard({ book, onSelect }: BookCardProps) {
  return (
    <Card 
        className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer"
        onClick={() => onSelect(book)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[2/3] w-full">
          <Image
            src={book.coverUrl || defaultCover?.imageUrl || ''}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            data-ai-hint={!book.coverUrl ? defaultCover?.imageHint : ''}
          />
        </div>
        <div className="p-4">
          <h3 className="font-headline font-semibold truncate" title={book.title}>
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {book.authors.join(', ')}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <Badge variant="secondary">{book.status}</Badge>
            <StarRating rating={book.rating} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
