'use client';

import type { Book } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
  onBookUpdated: (updatedBook: Book) => void;
};

function StarRating({ rating }: { rating: number | null | undefined }) {
    if (!rating) return <span className="text-sm text-muted-foreground">Not rated</span>;
    return (
        <div className="flex items-center gap-1">
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
      <DialogContent className="sm:max-w-4xl grid-cols-1 md:grid-cols-3 grid gap-0 p-0 max-h-[90vh]">
        <div className="md:col-span-1 p-6 flex items-center justify-center bg-muted/30">
          <div className="relative aspect-[2/3] w-full max-w-[300px] h-auto rounded-lg overflow-hidden shadow-2xl group">
             <Image
                src={book.coverUrl || defaultCover?.imageUrl || ''}
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
             />
          </div>
        </div>
        <div className="md:col-span-2 p-8 flex flex-col">
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
                        <h4 className="font-headline text-lg font-semibold mb-2">My Notes</h4>
                        {book.notes ? (
                          <div className="text-base text-foreground/80 whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none bg-muted/20 p-4 rounded-md">
                              {book.notes}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-2 italic">No notes for this book yet.</p>
                        )}
                    </div>
                </div>
            </ScrollArea>
            <DialogFooter className='mt-auto flex-col sm:flex-row items-center justify-between pt-6 border-t'>
                <span className='text-sm text-muted-foreground self-start sm:self-center'>
                    {book.publishYear && `Published in ${book.publishYear}`}
                </span>
                {book.openLibraryId && (
                    <Button asChild variant="outline">
                        <Link href={`https://openlibrary.org/works/${book.openLibraryId}`} target="_blank" rel="noopener noreferrer">
                            Read More
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                )}
            </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
