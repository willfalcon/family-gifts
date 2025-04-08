import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { cache } from 'react';

export const getUserLists = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const lists = await prisma.list.findMany({
    where: {
      user: {
        id: session.user.id,
      },
    },
    include: {
      _count: {
        select: {
          items: true,
        },
      },
    },
  });

  return lists;
});

export const dashboardGetUserLists = cache(async (rest: boolean = false) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }
  const listsCount = await prisma.list.count({
    where: {
      user: {
        id: session.user.id,
      },
    },
  });
  const lists = await prisma.list.findMany({
    where: {
      user: {
        id: session.user.id,
      },
    },
    take: rest ? undefined : 3,
    skip: rest ? 3 : 0,
  });

  return {
    lists,
    total: listsCount,
  };
});
