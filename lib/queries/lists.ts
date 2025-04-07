import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { Event, User } from '@prisma/client';
import { cache } from 'react';
import { getActiveFamilyId } from '../rscUtils';

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

export const getDefaultListId = cache(async (userId: User['id']) => {
  try {
    const list = await prisma.list.findFirst({
      where: {
        user: {
          id: userId,
        },
        default: true,
      },
    });
    if (list) {
      return {
        success: true,
        listId: list.id,
        message: '',
      };
    }
    return {
      success: false,
      message: 'No default list found',
      listId: '',
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      listId: '',
    };
  }
});

export const getLists = cache(async (userId: User['id'] | undefined) => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      lists: [],
    };
  }

  if (!userId) {
    return {
      success: false,
      message: 'No lists yet.',
      lists: [],
    };
  }

  const activeFamilyId = await getActiveFamilyId();

  try {
    const lists = await prisma.list.findMany({
      where: {
        user: {
          id: userId,
        },
        visibleTo: {
          some: {
            id: activeFamilyId,
          },
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
    if (lists) {
      return {
        success: true,
        lists,
        message: '',
      };
    }
    return {
      success: false,
      message: 'No lists found',
      lists: [],
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      lists: [],
    };
  }
});
