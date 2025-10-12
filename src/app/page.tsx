import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Search, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AppLogo } from '@/components/logo';

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');

  const features = [
    {
      icon: Search,
      title: 'Powerful Search',
      description: 'Instantly find any book from a vast library to add to your personal collection.',
    },
    {
      icon: BookOpen,
      title: 'Organize Your Library',
      description: 'Categorize your books as owned, on your wishlist, completed, or loaned out.',
    },
    {
      icon: Star,
      title: 'Rate & Review',
      description: 'Keep personal notes and give 5-star ratings to remember your thoughts on every book.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-20 items-center justify-between px-4">
        <AppLogo />
        <Button asChild>
          <Link href="/login">Get Started</Link>
        </Button>
      </header>

      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center px-4 py-16 text-center md:py-24">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Your personal universe of books.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Organize your reading life with BookVerse. Search, track, and curate your personal library with beautiful simplicity.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/login">
              Start Your Library for Free <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </section>

        <section className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl border bg-card shadow-lg">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={1600}
                height={900}
                data-ai-hint={heroImage.imageHint}
                className="w-full"
                priority
              />
            )}
          </div>
        </section>

        <section className="container mx-auto px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to manage your reading life.</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              BookVerse provides a simple, beautiful interface to manage every book you own, read, or want to read.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-headline text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="container mx-auto border-t py-6 px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <AppLogo />
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} BookVerse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
