'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchMedia } from './search-media';
import type { NormalizedMedia } from '@/lib/types';
import { BOOK_STATUSES, MOVIE_STATUSES } from '@/lib/types';
import { useEffect, useState, useTransition } from 'react';
import { Loader2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Book, Movie } from '@prisma/client';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  // Book specific
  authors: z.string().optional(),
  openLibraryId: z.string().optional(),
  
  // Movie specific
  releaseYear: z.number().optional(),
  tmdbId: z.number().optional(),

  // Common
  mediaType: z.enum(['Book', 'Movie']),
  status: z.string(),
  rating: z.number().int().min(0).max(5).optional(),
  notes: z.string().optional(),
  description: z.string().optional(),
  coverUrl: z.string().url().optional().nullable(),
});

type AddBookFormProps = {
    onFormSubmit: (data: any, mediaId?: string) => void;
    mediaToEdit?: Book | Movie | null;
};

export function AddBookForm({ onFormSubmit, mediaToEdit }: AddBookFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [activeMediaType, setActiveMediaType] = useState<'Book' | 'Movie'>(mediaToEdit?.mediaType || 'Book');
  
  const isEditMode = !!mediaToEdit;
  
  const currentStatuses = activeMediaType === 'Book' ? BOOK_STATUSES : MOVIE_STATUSES;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: '',
        authors: '',
        status: activeMediaType === 'Book' ? 'Wishlist' : 'Watched',
        rating: 0,
        notes: '',
        description: '',
        mediaType: activeMediaType,
      },
  });

  useEffect(() => {
    if (mediaToEdit) {
      const editValues: any = {
        ...mediaToEdit,
        rating: mediaToEdit.rating ?? 0,
      }
      if (mediaToEdit.mediaType === 'Book') {
        editValues.authors = (mediaToEdit as Book).authors.join(', ');
      }
      form.reset(editValues);
      setActiveMediaType(mediaToEdit.mediaType);
    } else {
        form.reset({
            title: '',
            authors: '',
            releaseYear: undefined,
            status: 'Wishlist',
            rating: 0,
            notes: '',
            description: '',
            coverUrl: null,
            openLibraryId: undefined,
            tmdbId: undefined,
            mediaType: 'Book',
        });
        setActiveMediaType('Book');
    }
  }, [mediaToEdit, form]);
  
  const rating = form.watch('rating');

  const handleMediaSelect = (media: NormalizedMedia) => {
    setActiveMediaType(media.mediaType);
    if (media.mediaType === 'Book') {
      form.reset({
        ...form.getValues(),
        mediaType: 'Book',
        title: media.title,
        authors: media.authors.join(', '),
        coverUrl: media.coverUrl,
        openLibraryId: media.openLibraryId,
        publishYear: media.publishYear,
        description: media.description,
        status: 'Owned',
      });
    } else if (media.mediaType === 'Movie') {
        form.reset({
            ...form.getValues(),
            mediaType: 'Movie',
            title: media.title,
            coverUrl: media.posterUrl,
            tmdbId: media.tmdbId,
            releaseYear: media.releaseYear,
            description: media.overview,
            status: 'Watched',
        });
    }
  };
  
  const currentMediaType = form.watch('mediaType');

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      const commonData = {
        title: values.title,
        status: values.status,
        rating: values.rating === 0 ? null : values.rating,
        notes: values.notes,
        description: values.description,
        coverUrl: values.coverUrl,
        mediaType: values.mediaType,
      };

      let finalData;
      if (values.mediaType === 'Book') {
        finalData = {
          ...commonData,
          authors: values.authors ? values.authors.split(',').map(a => a.trim()) : [],
          openLibraryId: values.openLibraryId,
        }
      } else { // Movie
        finalData = {
            ...commonData,
            releaseYear: values.releaseYear,
            tmdbId: values.tmdbId,
        }
      }

      onFormSubmit(finalData, mediaToEdit?.id);

      toast({ 
        title: isEditMode ? 'Media Updated!' : 'Media Added!',
        description: `${finalData.title} has been ${isEditMode ? 'updated' : 'added'}.`
      });
    });
  };
  
  return (
    <div className="space-y-6">
      {!isEditMode && <SearchMedia onMediaSelect={handleMediaSelect} onSearchTypeChange={setActiveMediaType} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl><Input placeholder="The Lord of the Rings" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {currentMediaType === 'Book' && (
            <FormField
              control={form.control}
              name="authors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author(s)</FormLabel>
                  <FormControl><Input placeholder="J. R. R. Tolkien" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {currentMediaType === 'Movie' && (
             <FormField
                control={form.control}
                name="releaseYear"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Release Year</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="2023" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
          )}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {currentStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <button type="button" key={i} onClick={() => field.onChange(i + 1 === rating ? 0 : i + 1)}>
                                <Star className={`h-6 w-6 cursor-pointer transition-colors ${i < (rating || 0) ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground/30 hover:text-yellow-400'}`} />
                            </button>
                        ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>My Notes</FormLabel>
                <FormControl><Textarea placeholder="Your thoughts, quotes, or a short review..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? 'Save Changes' : 'Add to Library'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
