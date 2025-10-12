import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';
import Credentials from 'next-auth/providers/credentials';
import prisma from './prisma';
import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';

// Define the base config
const baseConfig: NextAuthConfig = {
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Hardcoded test user
        if (
          credentials.email === 'demo@bookverse.com' &&
          credentials.password === 'bookverse'
        ) {
          // Return a user object that satisfies the User type for the session
          return {
            id: 'demo-user-id',
            email: 'demo@bookverse.com',
            name: 'Demo User',
            image: null,
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
};

// This is a workaround to conditionally use the Prisma adapter.
// For the hardcoded demo user, we MUST use a JWT session strategy without a DB adapter
// to avoid environment-specific Prisma errors. For all other users, we use the adapter.
export const { handlers, auth, signIn, signOut } = NextAuth(req => {
  let isDemoUser = false;
  
  // Check request body for initial sign-in
  if (req?.body) {
    const bodyParams = new URLSearchParams(req.body as any);
    const email = bodyParams.get('email');
    if (email === 'demo@bookverse.com') {
      isDemoUser = true;
    }
  }
  
  // For subsequent session/JWT calls, the user info is in the token
  if (req?.auth?.token?.email === 'demo@bookverse.com') {
    isDemoUser = true;
  }
  
  if (isDemoUser) {
    // For the demo user, force JWT and do NOT use the adapter
    return {
      ...baseConfig,
      session: { strategy: 'jwt' },
    };
  }
  
  // For all other users, use the Prisma adapter with a database session
  return {
    ...baseConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'database' }, // Use database strategy when adapter is present
  };
});
