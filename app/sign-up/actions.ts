'use server';

import { prisma } from '@/prisma';
import { genSalt, hash } from 'bcrypt-ts';
import { signUpSchema } from './signUpSchema';
export async function signUp({ email, password, name }: { email: string; password: string; name: string }) {
  const validatedFields = signUpSchema.safeParse({ email, password, name });
  if (!validatedFields.success) {
    throw new Error('Invalid fields');
  }

  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      salt,
      name,
    },
  });

  // TODO: email confirmation
  return user;
}
