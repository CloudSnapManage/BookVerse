'use client';

import type { Book } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { Star, ExternalLink } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import Link from 'next/link';

const defaultCover = PlaceHolderImages.find(img => img.id === 'default-book-cover');

type BookDetailsDialogProps = {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function StarRating({ rating }: { rating: number | null | undefined }) {
    if (!rating) return <span className="text-sm text-muted-foreground">Not rated</span>;
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
            ))}
        </div>
    );
}

export function BookDetailsDialog({ book, open, onOpenChange }: BookDetailsDialogProps) {
  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl grid-cols-1 md:grid-cols-3 grid gap-0 p-0 max-h-[90vh]">
        <div className="md:col-span-1">
          <div className="relative aspect-[2/3] w-full h-full min-h-[300px] rounded-l-lg overflow-hidden">
             <Image
                src={book.coverUrl || defaultCover?.imageUrl || ''}
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
             />
          </div>
        </div>
        <div className="md:col-span-2 p-6 flex flex-col">
            <DialogHeader>
                <DialogTitle className="font-headline text-2xl mb-1">{book.title}</DialogTitle>
                <DialogDescription className="text-base">{book.authors.join(', ')}</DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-between mt-4">
                <Badge variant="secondary">{book.status}</Badge>
                <StarRating rating={book.rating} />
            </div>
            <ScrollArea className="flex-grow mt-6 pr-4 -mr-4">
                <div className="space-y-4">
                    {book.notes && (
                        <div>
                            <h4 className="font-semibold">My Notes</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">
                                {book.notes}
                            </p>
                        </div>
                    )}
                     {!book.notes && (
                        <p className="text-sm text-muted-foreground">No notes for this book yet.</p>
                     )}
                </div>
            </ScrollArea>
            <div className='mt-4 flex items-center justify-between pt-4 border-t'>
                <span className='text-xs text-muted-foreground'>
                    {book.publishYear && `Published in ${book.publishYear}`}
                </span>
                {book.openLibraryId && (
                    <Button asChild variant="outline" size="sm">
                        <Link href={`https://openlibrary.org/works/${book.openLibraryId}`} target="_blank" rel="noopener noreferrer">
                            Read More
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
