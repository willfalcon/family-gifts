import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { Prisma } from '@prisma/client';
import { cache } from 'react';
import { getListInclude } from './items';

export type GetUserLists = Prisma.ListGetPayload<{
  include: {
    _count: {
      select: {
        items: true;
      };
    };
  };
}>[];

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
    include: getListInclude,
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
    include: getListInclude,
  });

  return {
    lists,
    total: listsCount,
  };
});

export const getSharedLists = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const lists = await prisma.list.findMany({
    where: {
      visibleToUsers: {
        some: {
          id: session.user.id,
        },
      },
    },
    include: {
      user: true,
      items: true,
    },
  });

  return lists;
});

export type GetSharedLists = Prisma.ListGetPayload<{
  include: {
    user: true;
    items: true;
  };
}>;
