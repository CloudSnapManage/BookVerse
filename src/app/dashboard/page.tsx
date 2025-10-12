'use client';

import { useState, useEffect } from 'react';
import type { Book } from '@prisma/client';
import { Header } from '@/components/header';
import type { User } from 'next-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, BookOpenCheck, Library, Star, Trophy } from 'lucide-react';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { BOOK_STATUSES } from '@/lib/types';
import Link from 'next/link';

const demoUser: User = {
  id: 'clx1v2q2y000012b1a51a1b1a',
  email: 'demo@bookverse.com',
  name: 'Demo User',
  image: null,
};

const LOCAL_STORAGE_KEY = 'bookverse-library';

export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    try {
      const storedBooks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedBooks) {
        const parsedBooks = JSON.parse(storedBooks).map((book: any) => ({
            ...book,
            createdAt: new Date(book.createdAt),
            updatedAt: new Date(book.updatedAt),
        }));
        setBooks(parsedBooks);
      }
    } catch (error) {
      console.error('Failed to parse books from localStorage', error);
      setBooks([]);
    }
  }, []);

  const totalBooks = books.length;
  const completedBooks = books.filter(b => b.status === 'Completed').length;
  const averageRating = books.reduce((acc, b) => acc + (b.rating || 0), 0) / (books.filter(b => b.rating).length || 1);

  const statusCounts = BOOK_STATUSES.map(status => ({
    name: status,
    count: books.filter(b => b.status === status).length,
  }));

  const chartData = statusCounts.map(item => ({
    name: item.name,
    books: item.count,
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                <Library className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBooks}</div>
                <p className="text-xs text-muted-foreground">in your entire collection</p>
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
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageRating.toFixed(1)} / 5.0</div>
                <p className="text-xs text-muted-foreground">across all your rated books</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className='font-headline'>Library Breakdown</CardTitle>
                    <CardDescription>A look at your books by their status.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                    <RechartsBarChart data={chartData}>
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
          </div>

        </div>
      </main>
    </div>
  );
}
