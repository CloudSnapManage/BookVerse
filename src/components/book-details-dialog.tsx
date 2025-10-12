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
import { Star } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
      <DialogContent className="sm:max-w-3xl grid-cols-1 md:grid-cols-3 grid gap-8 p-0">
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
            <div className="mt-6 space-y-4 flex-grow overflow-y-auto pr-2">
                <h4 className="font-semibold">My Notes</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {book.notes || 'You haven\'t added any notes for this book yet.'}
                </p>
            </div>
            <div className='mt-4 text-xs text-muted-foreground'>
                {book.publishYear && <span>Published in {book.publishYear}</span>}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
