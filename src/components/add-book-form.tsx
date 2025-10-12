'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchBooks } from './search-books';
import type { NormalizedBook } from '@/lib/types';
import { BOOK_STATUSES } from '@/lib/types';
import { useEffect, useTransition } from 'react';
import { Loader2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Book } from '@prisma/client';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  authors: z.string().min(1, 'Author is required'),
  status: z.enum(BOOK_STATUSES),
  rating: z.number().int().min(0).max(5).optional(),
  notes: z.string().optional(),
  description: z.string().optional(),
  coverUrl: z.string().url().optional().nullable(),
  openLibraryId: z.string().optional(),
  publishYear: z.number().optional(),
});

type AddBookFormProps = {
    onFormSubmit: (data: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'userId'>, bookId?: string) => void;
    bookToEdit?: Book | null;
};

export function AddBookForm({ onFormSubmit, bookToEdit }: AddBookFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const isEditMode = !!bookToEdit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditMode ? {
      ...bookToEdit,
      authors: bookToEdit.authors.join(', '),
      rating: bookToEdit.rating ?? 0,
    } : {
      title: '',
      authors: '',
      status: 'Wishlist',
      rating: 0,
      notes: '',
      description: '',
    },
  });

  useEffect(() => {
    if (bookToEdit) {
      form.reset({
        ...bookToEdit,
        authors: bookToEdit.authors.join(', '),
        rating: bookToEdit.rating ?? 0,
      });
    } else {
        form.reset({
            title: '',
            authors: '',
            status: 'Wishlist',
            rating: 0,
            notes: '',
            description: '',
            coverUrl: null,
            openLibraryId: undefined,
            publishYear: undefined
        });
    }
  }, [bookToEdit, form]);
  
  const rating = form.watch('rating');

  const handleBookSelect = (book: NormalizedBook) => {
    form.reset({
      ...form.getValues(),
      title: book.title,
      authors: book.authors.join(', '),
      coverUrl: book.coverUrl,
      openLibraryId: book.openLibraryId,
      publishYear: book.publishYear,
      description: book.description,
      status: 'Owned', // Default to Owned when selecting a book
    });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      const bookData = {
        ...values,
        authors: values.authors.split(',').map(a => a.trim()),
        rating: values.rating === 0 ? null : values.rating,
      };

      onFormSubmit(bookData, bookToEdit?.id);

      toast({ 
        title: isEditMode ? 'Book Updated!' : 'Book Added!',
        description: `${bookData.title} has been ${isEditMode ? 'updated' : 'added'}.`
      });
    });
  };

  return (
    <div className="space-y-6">
      {!isEditMode && <SearchBooks onBookSelect={handleBookSelect} />}
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
                      {BOOK_STATUSES.map(status => (
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
