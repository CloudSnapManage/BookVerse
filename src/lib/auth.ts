import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';
import Credentials from 'next-auth/providers/credentials';
import prisma from './prisma';
import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';

// Separate the credentials provider for special handling
const credentialsProvider = Credentials({
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
      // This is a special flag to indicate we're using the demo user
      // It's a bit of a hack, but it tells our main config to skip the DB adapter.
      (credentials as any).isDemoUser = true;

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
});

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
    credentialsProvider,
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

// Dynamically create the final config based on the request
export const { handlers, auth, signIn, signOut } = NextAuth((req) => {
  if (req) {
    const isDemoUser = req.body
      ? (new URLSearchParams(req.body as any).get('email')) === 'demo@bookverse.com'
      : false;

    if (isDemoUser) {
      // If it's the demo user, use JWT sessions without a database adapter
      return {
        ...baseConfig,
        session: { strategy: 'jwt' },
      };
    }
  }

  // For all other users, use the Prisma adapter with the database
  return {
    ...baseConfig,
    adapter: PrismaAdapter(prisma),
  };
});
