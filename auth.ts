// import NextAuth, { type DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import { Adapter } from 'next-auth/adapters';

import authConfig from './auth.config';
import { prisma } from './prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token }) {
      // Fetch the role from the database if not present in token
      if (token && session.user) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
        if (dbUser) {
          session.user.id = dbUser.id;
        }
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      const existing = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          lists: true,
        },
      });
      if (!existing) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            lists: {
              create: {
                name: 'Default List',
              },
            },
          },
        });
      }
    },
  },
  ...authConfig,
});
