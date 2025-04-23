import { compare } from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import type { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import { getUserByEmail } from './lib/queries/user';

// Notice this is only an object, not a full Auth.js instance

export const providers: Provider[] = [
  Google,
  Credentials({
    credentials: {
      email: {},
      password: {},
    },
    authorize: async (credentials: any) => {
      console.log('credentials', credentials);
      if (!credentials?.email || !credentials.password) {
        throw new Error('Invalid credentials');
      }
      const user = await getUserByEmail(credentials.email as string);
      if (!user) {
        throw new Error('User not found');
      }
      if (!user.password) {
        throw new Error('You have no password set. Use another way to sign in.');
      }
      const passwordsMatch = await compare(credentials.password as string, user.password);
      if (!passwordsMatch) {
        throw new Error('Wrong password.');
      }
      return user;
    },
  }),
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === 'function') {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== 'credentials');

export default {
  providers,
} satisfies NextAuthConfig;
