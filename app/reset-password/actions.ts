'use server';

import { getUserByResetPasswordToken } from '@/lib/queries/user';
import { prisma } from '@/prisma';
import { genSalt, hash } from 'bcrypt-ts';

export async function resetPassword(token: string, password: string) {
  const user = await getUserByResetPasswordToken(token);
  if (!user) {
    throw new Error('User not found');
  }
  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordTokenExpiry: null,
    },
  });
}
