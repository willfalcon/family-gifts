'use server';

import { prisma } from '@/prisma';
import bcrypt from 'bcryptjs';
import { signUpSchema } from './signUpSchema';
export async function signUp({ email, password, name }: { email: string; password: string; name: string }) {
  const validatedFields = signUpSchema.safeParse({ email, password, name });
  if (!validatedFields.success) {
    throw new Error('Invalid fields');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      salt,
      name,
    },
  });

  // TODO: email confirmation
  return user;
}
