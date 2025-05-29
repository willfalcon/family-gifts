'use server';

import { prisma } from '@/prisma';
import { hash } from 'argon2';
import { signUpSchema } from './signUpSchema';
export async function signUp({ email, password, name }: { email: string; password: string; name: string }) {
  const validatedFields = signUpSchema.safeParse({ email, password, name });
  if (!validatedFields.success) {
    throw new Error('Invalid fields');
  }

  const hashedPassword = await hash(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  // TODO: email confirmation
  return user;
}
