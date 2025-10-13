import type { Metadata } from 'next';
import { Inter, Literata } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { SettingsProvider } from '@/hooks/use-settings';

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
        <SettingsProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="slate"
            enableSystem
            themes={['slate', 'dark-slate', 'zinc', 'dark-zinc', 'rose', 'dark-rose', 'violet', 'dark-violet', 'green', 'dark-green']}
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
