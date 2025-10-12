'use client';

import type { Book, Movie, Anime } from '@/lib/types';
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
import { Star, ExternalLink, Trash2, Edit, X, Tv, Heart } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const defaultBookCover = PlaceHolderImages.find(img => img.id === 'default-book-cover');
const defaultMoviePoster = PlaceHolderImages.find(img => img.id === 'default-movie-poster') || defaultBookCover;
const defaultAnimePoster = PlaceHolderImages.find(img => img.id === 'default-anime-poster') || defaultBookCover;


type MediaDetailsDialogProps = {
  media: Book | Movie | Anime | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (media: Book | Movie | Anime) => void;
  onDelete: (mediaId: string) => void;
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

export function MediaDetailsDialog({ media, open, onOpenChange, onEdit, onDelete }: MediaDetailsDialogProps) {
  if (!media) return null;

  const isBook = media.mediaType === 'Book';
  const isMovie = media.mediaType === 'Movie';
  const isAnime = media.mediaType === 'Anime';
  
  const coverUrl = media.coverUrl;
  let defaultCover = defaultBookCover;
  if (isMovie) defaultCover = defaultMoviePoster;
  if (isAnime) defaultCover = defaultAnimePoster;

  const book = isBook ? media as Book : null;
  const movie = isMovie ? media as Movie : null;
  const anime = isAnime ? media as Anime : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl grid-cols-1 md:grid-cols-3 grid gap-0 p-0 max-h-[90vh]">
        
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(media)}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this item from your library.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(media.id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <div className="md:col-span-1 p-6 flex items-center justify-center bg-muted/30">
          <div className="relative aspect-[2/3] w-full max-w-[300px] h-auto rounded-lg overflow-hidden shadow-2xl group">
             <Image
                src={coverUrl || defaultCover?.imageUrl || ''}
                alt={`Cover of ${media.title}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
             />
          </div>
        </div>
        <div className="md:col-span-2 p-8 pt-16 md:pt-8 flex flex-col">
            <DialogHeader className="text-left">
                <DialogTitle className="font-headline text-3xl mb-1">{media.title}</DialogTitle>
                {isBook && <DialogDescription className="text-lg text-muted-foreground">{book.authors.join(', ')}</DialogDescription>}
            </DialogHeader>
            <div className="flex items-center justify-between mt-6">
                <Badge variant={media.status === 'Completed' || media.status === 'Watched' ? 'default' : 'secondary'} className="text-sm py-1 px-3">{media.status}</Badge>
                <StarRating rating={media.rating} />
            </div>
            <ScrollArea className="flex-grow my-6 pr-4 -mr-4">
                <div className="space-y-6">
                    {media.description && (
                        <div>
                            <h4 className="font-headline text-lg font-semibold mb-2">Synopsis</h4>
                            <div className="text-base text-foreground/80 whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                                {media.description}
                            </div>
                        </div>
                    )}
                    {isAnime && anime?.favoriteEpisode && (
                      <div>
                        <h4 className="font-headline text-lg font-semibold mb-2 flex items-center gap-2">
                          <Heart className="h-5 w-5 text-primary" />
                          Favorite Episode
                        </h4>
                        <div className="text-base text-foreground/80 whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none bg-muted/20 p-4 rounded-md">
                            {anime.favoriteEpisode}
                        </div>
                      </div>
                    )}
                    <div>
                        <h4 className="font-headline text-lg font-semibold mb-2">My Notes</h4>
                        {media.notes ? (
                          <div className="text-base text-foreground/80 whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none bg-muted/20 p-4 rounded-md">
                              {media.notes}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-2 italic">No notes for this item yet.</p>
                        )}
                    </div>
                </div>
            </ScrollArea>
            <DialogFooter className='mt-auto flex-col sm:flex-row items-center justify-between pt-6 border-t'>
                <span className='text-sm text-muted-foreground self-start sm:self-center flex items-center gap-2'>
                    {isBook && book?.publishYear && `Published in ${book.publishYear}`}
                    {isMovie && movie?.releaseYear && `Released in ${movie.releaseYear}`}
                    {isAnime && anime?.episodes && <><Tv className="h-4 w-4" /> {anime.episodes} episodes</>}
                </span>
                {isBook && book?.openLibraryId && (
                    <Button asChild variant="outline">
                        <Link href={`https://openlibrary.org/works/${book.openLibraryId}`} target="_blank" rel="noopener noreferrer">
                            Read More
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                )}
                 {isMovie && movie?.tmdbId && (
                    <Button asChild variant="outline">
                        <Link href={`https://www.themoviedb.org/movie/${movie.tmdbId}`} target="_blank" rel="noopener noreferrer">
                            View on TMDb
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                )}
                 {isAnime && anime?.jikanMalId && (
                    <Button asChild variant="outline">
                        <Link href={`https://myanimelist.net/anime/${anime.jikanMalId}`} target="_blank" rel="noopener noreferrer">
                            View on MyAnimeList
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
