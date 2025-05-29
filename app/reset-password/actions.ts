'use server';

import { getUserByResetPasswordToken } from '@/lib/queries/user';
import { prisma } from '@/prisma';
import { hash } from 'argon2';

export async function resetPassword(token: string, password: string) {
  const user = await getUserByResetPasswordToken(token);
  if (!user) {
    throw new Error('User not found');
  }
  const hashedPassword = await hash(password);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordTokenExpiry: null,
    },
  });
}
