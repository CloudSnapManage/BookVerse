import { DebugMenu } from '@/components/debug/debug-menu';
import { Header } from '@/components/header';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header user={session.user} />
      <main className="flex-1">{children}</main>
      <DebugMenu />
    </div>
  );
}
