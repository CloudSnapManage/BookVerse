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
import { cn } from '@/lib/utils';

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

function StarRating({ rating, className }: { rating: number | null | undefined, className?: string }) {
    if (!rating) return <span className={cn("text-sm text-muted-foreground", className)}>Not rated</span>;
    return (
        <div className={cn("flex items-center gap-1", className)}>
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

  const externalLink = isBook && book?.openLibraryId ? `https://openlibrary.org/works/${book.openLibraryId}`
    : isMovie && movie?.tmdbId ? `https://www.themoviedb.org/movie/${movie.tmdbId}`
    : isAnime && anime?.jikanMalId ? `https://myanimelist.net/anime/${anime.jikanMalId}`
    : null;

  const externalLinkText = isBook ? 'View on Open Library' : isMovie ? 'View on TMDb' : 'View on MyAnimeList';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full grid-cols-1 md:grid-cols-3 grid gap-0 p-0 max-h-[90vh] overflow-hidden">
        
        {/* --- Header Section with Background --- */}
        <div className="md:col-span-3 relative flex items-end p-8 min-h-[200px] text-primary-foreground overflow-hidden">
           <div className="absolute inset-0">
             <Image
                src={coverUrl || defaultCover?.imageUrl || ''}
                alt={`Background for ${media.title}`}
                fill
                className="object-cover scale-125 blur-lg brightness-50"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
           </div>
          
           <div className="relative z-10 w-full flex justify-between items-end">
              <div>
                <DialogTitle className="font-headline text-3xl mb-1 drop-shadow-md text-foreground">{media.title}</DialogTitle>
                {isBook && <DialogDescription className="text-lg text-muted-foreground drop-shadow">{book.authors.join(', ')}</DialogDescription>}
                {(isMovie && movie?.releaseYear) && <DialogDescription className="text-lg text-muted-foreground drop-shadow">{movie.releaseYear}</DialogDescription>}
                {(isAnime && anime?.episodes) && <DialogDescription className="text-lg text-muted-foreground drop-shadow flex items-center gap-2"><Tv className="h-5 w-5" /> {anime.episodes} episodes</DialogDescription>}
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(media)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive">
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
                {externalLink && (
                  <Button asChild variant="outline" size="icon" className='h-8 w-8'>
                      <Link href={externalLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          <span className='sr-only'>{externalLinkText}</span>
                      </Link>
                  </Button>
                )}
              </div>
           </div>
        </div>
        
        {/* --- Main Content Section --- */}
        <div className="md:col-span-3 grid md:grid-cols-3 gap-8 p-8 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="md:col-span-1 flex flex-col items-start gap-6">
              <div className="relative aspect-[2/3] w-full max-w-[300px] h-auto rounded-lg overflow-hidden shadow-xl group mx-auto">
                <Image
                    src={coverUrl || defaultCover?.imageUrl || ''}
                    alt={`Cover of ${media.title}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 80vw, 25vw"
                />
              </div>
              <div className="w-full space-y-4 rounded-lg border bg-card text-card-foreground p-4">
                  <div className="flex items-center justify-between">
                    <span className='text-sm font-medium'>Status</span>
                    <Badge variant={media.status === 'Completed' || media.status === 'Watched' ? 'default' : 'secondary'} className="text-sm py-1 px-3">{media.status}</Badge>
                  </div>
                   <div className="flex items-center justify-between">
                    <span className='text-sm font-medium'>My Rating</span>
                    <StarRating rating={media.rating} />
                  </div>
              </div>
          </div>
          <div className="md:col-span-2">
            <ScrollArea className="h-full pr-4 -mr-4">
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
                          <div className="text-base text-foreground/80 whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none bg-muted/50 p-4 rounded-md border">
                              {anime.favoriteEpisode}
                          </div>
                        </div>
                      )}
                      <div>
                          <h4 className="font-headline text-lg font-semibold mb-2">My Notes</h4>
                          {media.notes ? (
                            <div className="text-base text-foreground/80 whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none bg-muted/50 p-4 rounded-md border">
                                {media.notes}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground mt-2 italic">No notes for this item yet.</p>
                          )}
                      </div>
                  </div>
              </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
