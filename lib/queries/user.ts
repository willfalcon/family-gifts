import { prisma } from '@/prisma';
import { Prisma, User } from '@prisma/client';
import { cache } from 'react';

export const getUser = cache(async (id: User['id']) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      managing: true,
      createdEvents: true,
    },
  });

  if (user) {
    return user;
  }
  throw new Error('User not found');
});

export type GetUser = Prisma.UserGetPayload<{
  include: {
    managing: true;
    createdEvents: true;
  };
}>;
