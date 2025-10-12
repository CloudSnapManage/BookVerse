import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const email = 'demo@bookverse.com';
  const hashedPassword = await bcrypt.hash('bookverse', 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
      email,
      name: 'Demo User',
      emailVerified: new Date(),
      password: hashedPassword,
    },
  });

  console.log(`Upserted user: ${user.email}`);

  // You can add more seed data here if needed, for example, sample books for the demo user.
  
  // Example of adding a book for the user:
  // await prisma.book.create({
  //   data: {
  //     title: 'The Hobbit',
  //     authors: ['J.R.R. Tolkien'],
  //     status: 'Owned',
  //     userId: user.id,
  //     coverUrl: 'https://covers.openlibrary.org/b/id/10329863-L.jpg',
  //     openLibraryId: 'OL441813W',
  //     publishYear: 1937,
  //     rating: 5
  //   }
  // });
  // console.log('Added sample book for demo user.');


  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
