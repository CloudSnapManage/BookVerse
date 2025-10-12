import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';
import Credentials from 'next-auth/providers/credentials';
import prisma from './prisma';
import bcrypt from 'bcryptjs';
import type { User } from '@prisma/client';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: 'no-reply@bookverse.app',
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials.email || !credentials.password) {
          return null;
        }

        // Hardcoded test user
        if (
          credentials.email === 'demo@bookverse.com' &&
          credentials.password === 'bookverse'
        ) {
          // Return a user object that satisfies the User type for the session
          // This user won't be in the database, but it's enough for session management
          return {
            id: 'demo-user-id',
            email: 'demo@bookverse.com',
            name: 'Demo User',
            emailVerified: new Date(),
            image: null,
            password: null, // No password hash needed for demo user
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });
        
        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (isPasswordValid) {
          return user;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    verifyRequest: '/login/magic-link-sent',
  },
  callbacks: {
    async session({ session, token }) {
        if (token.sub) {
          session.user.id = token.sub;
        }
        return session;
      },
      async jwt({ token }) {
        return token;
      },
  },
});
