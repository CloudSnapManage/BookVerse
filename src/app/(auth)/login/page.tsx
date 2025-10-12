import { LoginForm } from '@/components/auth/login-form';
import { AppLogo } from '@/components/logo';
import { DebugMenu } from '@/components/debug/debug-menu';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
            <AppLogo />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className='font-headline text-2xl'>Welcome to BookVerse</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
      <DebugMenu />
    </div>
  );
}
