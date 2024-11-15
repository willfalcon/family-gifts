// import NextAuth, { type DefaultSession } from 'next-auth';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import authConfig from './auth.config';
import { Adapter } from 'next-auth/adapters';

// declare module 'next-auth' {
//   // interface User {
//   //   // role: string; // Add role to the User interface
//   // }

//   interface Session {
//     user: {
//       role: string; // Add role to the session user
//     } & DefaultSession['user'];
//   }
// }

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token }) {
      // Fetch the role from the database if not present in token
      if (token && session.user) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
        if (dbUser) {
          // session.user.role = dbUser.role || 'MEMBER';
          session.user.id = dbUser.id;
        }
      }
      return session;
    },
  },
  ...authConfig,
});
