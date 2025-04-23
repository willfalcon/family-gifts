'use server';

import { getUserByResetPasswordToken } from '@/lib/queries/user';
import { prisma } from '@/prisma';
import bcrypt from 'bcryptjs';

export async function resetPassword(token: string, password: string) {
  const user = await getUserByResetPasswordToken(token);
  if (!user) {
    throw new Error('User not found');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordTokenExpiry: null,
    },
  });
}
