import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { Item, List, Prisma } from '@prisma/client';
import { cache } from 'react';
import { generateRandomHex } from '../rscUtils';

export type GetList = Prisma.ListGetPayload<{
  include: {
    items: {
      include: {
        purchasedBy: true;
      };
    };
    user: true;
    visibleToFamilies: true;
    visibleToEvents: true;
    visibleToUsers: true;
  };
}>;

export const getListInclude = {
  items: {
    include: {
      purchasedBy: true,
    },
  },
  user: true,
  visibleToFamilies: true,
  visibleToEvents: true,
  visibleToUsers: true,
};

export const getList = cache(async (id: List['id'], shareLink?: string) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  // TODO: restrict by visibility

  const list = await prisma.list.findUnique({
    where: {
      id,
    },
    include: getListInclude,
  });

  return list;
});

export const getItem = cache(async (id: Item['id']) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const item = await prisma.item.findUnique({
    where: {
      id,
    },
    include: {
      purchasedBy: true,
    },
  });
  return item;
});

export type ItemFromGetList = GetList['items'][number];

export const getListForEdit = cache(async (id: List['id']) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const list = await prisma.list.findUnique({
    where: {
      id,
      user: {
        id: session.user.id,
      },
    },
    include: {
      items: true,
      visibleToFamilies: true,
      visibleToEvents: true,
      visibleToUsers: true,
    },
  });

  if (list && !list.shareLink) {
    const shareLink = generateRandomHex(10);
    const list = await prisma.list.update({
      where: {
        id,
      },
      data: {
        shareLink,
      },
      include: {
        items: true,
        visibleToFamilies: true,
        visibleToEvents: true,
        visibleToUsers: true,
      },
    });
    return list;
  }

  return list;
});

export type GetListForEdit = Prisma.ListGetPayload<{
  include: {
    items: true;
    visibleToFamilies: true;
    visibleToEvents: true;
    visibleToUsers: true;
  };
}>;
