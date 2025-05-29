import { compare } from 'bcrypt-ts';
import { CredentialsSignin, type NextAuthConfig } from 'next-auth';
import type { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import { getUserByEmail } from './lib/queries/user';

// Notice this is only an object, not a full Auth.js instance

export class InvalidCredentialsError extends CredentialsSignin {
  code = 'invalid_credentials';
}

class NoPasswordError extends CredentialsSignin {
  code = 'no_password';
}

export const providers: Provider[] = [
  Google,
  Credentials({
    credentials: {
      email: {},
      password: {},
    },
    authorize: async (credentials: any) => {
      if (!credentials?.email || !credentials.password) {
        throw new InvalidCredentialsError();
      }
      const user = await getUserByEmail(credentials.email as string);
      if (!user) {
        throw new InvalidCredentialsError();
      }
      if (!user.password) {
        throw new NoPasswordError();
      }
      const passwordsMatch = await compare(credentials.password as string, user.password);
      if (!passwordsMatch) {
        throw new InvalidCredentialsError();
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
