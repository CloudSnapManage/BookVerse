import type { Metadata } from 'next';
import { Inter, Literata } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const literata = Literata({ subsets: ['latin'], variable: '--font-literata' });

export const metadata: Metadata = {
  title: 'BookVerse | Your Personal Library Companion',
  description: 'Organize your reading life. Search, track, and review your books all in one place.',
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-body antialiased', inter.variable, literata.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="slate"
          enableSystem
          themes={['slate', 'zinc', 'rose', 'violet', 'green']}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
