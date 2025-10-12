import { AppLogo } from '@/components/logo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MailCheck } from 'lucide-react';
import Link from 'next/link';

export default function MagicLinkSentPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <AppLogo />
        </div>
        <Card>
          <CardHeader className="items-center">
            <MailCheck className="h-12 w-12 text-primary" />
            <CardTitle className="font-headline text-2xl mt-4">Check your inbox</CardTitle>
            <CardDescription>A magic link has been sent to your email address.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Click the link in the email to sign in to your account. If you don't see it, please check your spam folder.
            </p>
            <Link href="/login" className="mt-6 inline-block text-sm text-primary hover:underline">
              &larr; Back to login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
