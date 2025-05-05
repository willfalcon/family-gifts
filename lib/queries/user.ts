import { InvalidCredentialsError } from '@/auth.config';
import { prisma } from '@/prisma';
import { Prisma, User } from '@prisma/client';

export const getUser = async (id: User['id']) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      managing: true,
      createdEvents: true,
      families: true,
    },
  });

  if (user) {
    return user;
  }
  throw new Error('User not found');
};

export type GetUser = Prisma.UserGetPayload<{
  include: {
    managing: true;
    createdEvents: true;
    families: true;
  };
}>;

export const getUserByEmail = async (email: User['email']) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    return user;
  }
  throw new InvalidCredentialsError();
};

export const getUserByResetPasswordToken = async (token: User['resetPasswordToken']) => {
  const user = await prisma.user.findFirst({
    where: { resetPasswordToken: token },
  });

  if (user) {
    return user;
  }

  throw new Error('User not found');
};
