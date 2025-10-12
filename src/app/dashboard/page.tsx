'use client';

import { useState, useEffect } from 'react';
import type { Book, Movie } from '@prisma/client';
import { Header } from '@/components/header';
import type { User } from 'next-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpenCheck, Clapperboard, Film, Library, Star } from 'lucide-react';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { BOOK_STATUSES, MOVIE_STATUSES } from '@/lib/types';
import Link from 'next/link';

const demoUser: User = {
  id: 'clx1v2q2y000012b1a51a1b1a',
  email: 'demo@bookverse.com',
  name: 'Demo User',
  image: null,
};

const LOCAL_STORAGE_KEY_BOOKS = 'bookverse-library';
const LOCAL_STORAGE_KEY_MOVIES = 'movieverse-library';

export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    try {
      const storedBooks = localStorage.getItem(LOCAL_STORAGE_KEY_BOOKS);
      if (storedBooks) {
        const parsedBooks = JSON.parse(storedBooks).map((book: any) => ({
            ...book,
            createdAt: new Date(book.createdAt),
            updatedAt: new Date(book.updatedAt),
        }));
        setBooks(parsedBooks);
      }
      const storedMovies = localStorage.getItem(LOCAL_STORAGE_KEY_MOVIES);
      if (storedMovies) {
        const parsedMovies = JSON.parse(storedMovies).map((movie: any) => ({
            ...movie,
            createdAt: new Date(movie.createdAt),
            updatedAt: new Date(movie.updatedAt),
        }));
        setMovies(parsedMovies);
      }
    } catch (error) {
      console.error('Failed to parse items from localStorage', error);
      setBooks([]);
      setMovies([]);
    }
  }, []);
  
  const allMedia = [...books, ...movies];

  const totalBooks = books.length;
  const totalMovies = movies.length;
  const completedBooks = books.filter(b => b.status === 'Completed').length;
  const watchedMovies = movies.filter(m => m.status === 'Watched').length;
  const averageRating = allMedia.reduce((acc, b) => acc + (b.rating || 0), 0) / (allMedia.filter(b => b.rating).length || 1);

  const bookStatusCounts = BOOK_STATUSES.map(status => ({
    name: status,
    count: books.filter(b => b.status === status).length,
  }));
  
  const movieStatusCounts = MOVIE_STATUSES.map(status => ({
    name: status,
    count: movies.filter(m => m.status === status).length,
  }));

  const bookChartData = bookStatusCounts.map(item => ({
    name: item.name,
    books: item.count,
  }));

  const movieChartData = movieStatusCounts.map(item => ({
    name: item.name,
    movies: item.count,
  }));

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header user={demoUser} />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">My Dashboard</h1>
            <Link href="/" className="text-sm text-primary hover:underline">
              &larr; Back to Library
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                <Library className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBooks}</div>
                <p className="text-xs text-muted-foreground">books in your collection</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
                <Film className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMovies}</div>
                <p className="text-xs text-muted-foreground">movies in your collection</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Books Completed</CardTitle>
                <BookOpenCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedBooks}</div>
                <p className="text-xs text-muted-foreground">books you've finished reading</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Movies Watched</CardTitle>
                <Clapperboard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{watchedMovies}</div>
                <p className="text-xs text-muted-foreground">movies you've finished watching</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className='font-headline'>Book Library Breakdown</CardTitle>
                    <CardDescription>A look at your books by their status.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                    <RechartsBarChart data={bookChartData}>
                        <XAxis
                            dataKey="name"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip 
                            cursor={{ fill: 'hsl(var(--accent))' }}
                            contentStyle={{ 
                                background: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: 'var(--radius)',
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                        <Bar dataKey="books" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                    </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className='font-headline'>Movie Library Breakdown</CardTitle>
                    <CardDescription>A look at your movies by their status.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                    <RechartsBarChart data={movieChartData}>
                        <XAxis
                            dataKey="name"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip 
                            cursor={{ fill: 'hsl(var(--accent))' }}
                            contentStyle={{ 
                                background: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: 'var(--radius)',
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                        <Bar dataKey="movies" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                    </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
