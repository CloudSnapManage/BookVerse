'use client';

import { useState, useEffect } from 'react';
import type { Book, Movie, Anime, KDrama } from '@/lib/types';
import { Header } from '@/components/header';
import type { User } from 'next-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpenCheck, Clapperboard, Film, Library, Star, Tv, Drama } from 'lucide-react';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { BOOK_STATUSES, MOVIE_STATUSES, ANIME_STATUSES, KDRAMA_STATUSES } from '@/lib/types';
import Link from 'next/link';

const demoUser: User = {
  id: 'clx1v2q2y000012b1a51a1b1a',
  email: 'demo@bookverse.com',
  name: 'Demo User',
  image: null,
};

const LOCAL_STORAGE_KEY_BOOKS = 'bookverse-library';
const LOCAL_STORAGE_KEY_MOVIES = 'movieverse-library';
const LOCAL_STORAGE_KEY_ANIME = 'animeverse-library';
const LOCAL_STORAGE_KEY_KDRAMA = 'kdramaverse-library';


export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [anime, setAnime] = useState<Anime[]>([]);
  const [kdramas, setKdramas] = useState<KDrama[]>([]);

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
      const storedAnime = localStorage.getItem(LOCAL_STORAGE_KEY_ANIME);
       if (storedAnime) {
        const parsedAnime = JSON.parse(storedAnime).map((a: any) => ({
            ...a,
            createdAt: new Date(a.createdAt),
            updatedAt: new Date(a.updatedAt),
        }));
        setAnime(parsedAnime);
      }
      const storedKDramas = localStorage.getItem(LOCAL_STORAGE_KEY_KDRAMA);
      if (storedKDramas) {
        const parsedKDramas = JSON.parse(storedKDramas).map((d: any) => ({
            ...d,
            createdAt: new Date(d.createdAt),
            updatedAt: new Date(d.updatedAt),
        }));
        setKdramas(parsedKDramas);
      }
    } catch (error) {
      console.error('Failed to parse items from localStorage', error);
      setBooks([]);
      setMovies([]);
      setAnime([]);
      setKdramas([]);
    }
  }, []);
  
  const allMedia = [...books, ...movies, ...anime, ...kdramas];

  const totalBooks = books.length;
  const totalMovies = movies.length;
  const totalAnime = anime.length;
  const totalKDramas = kdramas.length;
  const completedBooks = books.filter(b => b.status === 'Completed').length;
  const watchedMovies = movies.filter(m => m.status === 'Watched').length;
  const watchedAnime = anime.filter(a => a.status === 'Completed').length;
  const watchedKDramas = kdramas.filter(d => d.status === 'Completed').length;


  const bookStatusCounts = BOOK_STATUSES.map(status => ({
    name: status,
    count: books.filter(b => b.status === status).length,
  }));
  
  const movieStatusCounts = MOVIE_STATUSES.map(status => ({
    name: status,
    count: movies.filter(m => m.status === status).length,
  }));
  
  const animeStatusCounts = ANIME_STATUSES.map(status => ({
    name: status,
    count: anime.filter(a => a.status === status).length,
  }));

  const kdramaStatusCounts = KDRAMA_STATUSES.map(status => ({
    name: status,
    count: kdramas.filter(d => d.status === status).length,
  }));

  const bookChartData = bookStatusCounts.map(item => ({ name: item.name, books: item.count }));
  const movieChartData = movieStatusCounts.map(item => ({ name: item.name, movies: item.count }));
  const animeChartData = animeStatusCounts.map(item => ({ name: item.name, anime: item.count }));
  const kdramaChartData = kdramaStatusCounts.map(item => ({ name: item.name, dramas: item.count }));

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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                <Library className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBooks}</div>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
                <Film className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMovies}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Anime</CardTitle>
                <Tv className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAnime}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total K-Dramas</CardTitle>
                <Drama className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalKDramas}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Books Completed</CardTitle>
                <BookOpenCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedBooks}</div>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Movies Watched</CardTitle>
                <Clapperboard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{watchedMovies}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Anime Completed</CardTitle>
                <Clapperboard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{watchedAnime}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dramas Completed</CardTitle>
                <Clapperboard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{watchedKDramas}</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
            <Card>
                <CardHeader>
                    <CardTitle className='font-headline'>Book Library</CardTitle>
                    <CardDescription>Breakdown by status.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                    <RechartsBarChart data={bookChartData}>
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
                        <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}/>
                        <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                        <Bar dataKey="books" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                    </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className='font-headline'>Movie Library</CardTitle>
                    <CardDescription>Breakdown by status.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                    <RechartsBarChart data={movieChartData}>
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }} />
                        <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                        <Bar dataKey="movies" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                    </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className='font-headline'>Anime Library</CardTitle>
                    <CardDescription>Breakdown by status.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                    <RechartsBarChart data={animeChartData}>
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }} />
                        <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                        <Bar dataKey="anime" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                    </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className='font-headline'>K-Drama Library</CardTitle>
                    <CardDescription>Breakdown by status.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                    <RechartsBarChart data={kdramaChartData}>
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }} />
                        <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                        <Bar dataKey="dramas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
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
