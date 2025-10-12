import type { User } from 'next-auth';
import { AppLogo } from './logo';
import { UserNav } from './user-nav';

type HeaderProps = {
    user: User;
};

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <AppLogo />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserNav user={user} />
        </div>
      </div>
    </header>
  );
}
