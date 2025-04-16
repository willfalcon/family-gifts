import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { List, Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';
import { cache } from 'react';

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
    const shareLink = randomBytes(10).toString('hex');
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
