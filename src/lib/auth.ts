import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';

// Define the base config
const baseConfig: NextAuthConfig = {
  providers: [],
  session: {
    strategy: 'jwt',
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

export const { handlers, auth, signIn, signOut } = NextAuth(baseConfig);
