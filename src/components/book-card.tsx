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
                <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground/30'}`} />
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
    <div 
        className="group cursor-pointer"
        onClick={() => onSelect(book)}
    >
      <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="relative aspect-[2/3] w-full">
            <Image
              src={book.coverUrl || defaultCover?.imageUrl || ''}
              alt={`Cover of ${book.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
              data-ai-hint={!book.coverUrl ? defaultCover?.imageHint : ''}
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </div>
        </CardContent>
      </Card>
      <div className="pt-3">
        <h3 className="font-headline font-semibold text-base leading-tight truncate transition-colors group-hover:text-primary" title={book.title}>
            {book.title}
        </h3>
        <p className="text-sm text-muted-foreground truncate mt-0.5">
            {book.authors.join(', ')}
        </p>
        <div className="mt-2 flex items-center justify-between">
            <Badge variant={book.status === 'Completed' ? 'default' : 'secondary'}>{book.status}</Badge>
            <StarRating rating={book.rating} />
        </div>
      </div>
    </div>
  );
}
