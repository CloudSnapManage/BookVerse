import type { User } from 'next-auth';
import type { Book } from '@prisma/client';
import { AppLogo } from './logo';
import { UserNav } from './user-nav';
import { AddBookButton } from './add-book-button';


type HeaderProps = {
    user: User;
    onBookAdded: (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
};

export function Header({ user, onBookAdded }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <AppLogo />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <AddBookButton onBookAdded={onBookAdded}>
            Add Book
          </AddBookButton>
          <UserNav user={user} />
        </div>
      </div>
    </header>
  );
}
