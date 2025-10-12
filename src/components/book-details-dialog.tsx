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
import { Star, ExternalLink, Book as BookIcon } from 'lucide-react';
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
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < rating ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground/30'}`} />
            ))}
        </div>
    );
}

export function BookDetailsDialog({ book, open, onOpenChange }: BookDetailsDialogProps) {
  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl grid-cols-1 md:grid-cols-3 grid gap-0 p-0 max-h-[90vh]">
        <div className="md:col-span-1 p-6 flex items-center justify-center">
          <div className="relative aspect-[2/3] w-full max-w-[300px] h-auto rounded-lg overflow-hidden shadow-2xl">
             <Image
                src={book.coverUrl || defaultCover?.imageUrl || ''}
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
             />
          </div>
        </div>
        <div className="md:col-span-2 p-8 flex flex-col bg-muted/20">
            <DialogHeader className="text-left">
                <DialogTitle className="font-headline text-3xl mb-1">{book.title}</DialogTitle>
                <DialogDescription className="text-lg text-muted-foreground">{book.authors.join(', ')}</DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-between mt-6">
                <Badge variant={book.status === 'Completed' ? 'default' : 'secondary'} className="text-sm py-1 px-3">{book.status}</Badge>
                <StarRating rating={book.rating} />
            </div>
            <ScrollArea className="flex-grow my-6 pr-4 -mr-4">
                <div className="space-y-6">
                    <div>
                        <h4 className="font-headline text-lg font-semibold">My Notes</h4>
                        {book.notes ? (
                          <p className="text-base text-foreground/80 whitespace-pre-wrap mt-2 prose prose-sm dark:prose-invert max-w-none">
                              {book.notes}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-2 italic">No notes for this book yet.</p>
                        )}
                    </div>
                </div>
            </ScrollArea>
            <div className='mt-auto flex items-center justify-between pt-6 border-t'>
                <span className='text-sm text-muted-foreground'>
                    {book.publishYear && `Published in ${book.publishYear}`}
                </span>
                {book.openLibraryId && (
                    <Button asChild variant="outline">
                        <Link href={`https://openlibrary.org/works/${book.openLibraryId}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View on Open Library
                        </Link>
                    </Button>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
