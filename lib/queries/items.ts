import { auth } from '@/auth';
import { cache } from 'react';
import { getActiveFamilyId } from '../rscUtils';
import { prisma } from '@/prisma';
import { getActiveMember } from './family-members';
import { List, Prisma } from '@prisma/client';
import { ItemWithRefs, ListWithItems } from '@/prisma/types';
import { randomBytes } from 'crypto';

export const getItems = cache(async (limit?: number) => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      items: undefined,
    };
  }

  const activeFamilyId = await getActiveFamilyId();

  const items = await prisma.item.findMany({
    where: {
      member: {
        user: {
          id: session.user.id,
        },
        ...(activeFamilyId && {
          family: {
            is: {
              id: activeFamilyId,
            },
          },
        }),
      },
    },
    ...(limit && {
      take: limit,
    }),
    include: {
      member: true,
    },
  });

  return {
    success: true,
    message: '',
    items,
  };
});

export const getDefaultList = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      list: undefined,
    };
  }

  try {
    const list = await prisma.list.findFirst({
      where: {
        user: {
          id: session.user.id,
        },
        default: true,
      },
      include: {
        visibleTo: true,
        items: {
          include: {
            member: true,
            boughtBy: true,
          },
        },
      },
    });

    return {
      success: true,
      message: '',
      list,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      list: undefined,
    };
  }
});

export const getList = cache(async (id: List['id']) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  // TODO: restrict by visibility

  const list = await prisma.list.findUnique({
    where: {
      id,
    },
    include: {
      items: {
        include: {
          purchasedBy: true,
        },
      },
      user: true,
      visibleToFamilies: true,
      visibleToEvents: true,
      visibleToUsers: true,
    },
  });

  return list;
});

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

export const getListAll = cache(async (memberId: FamilyMember['id']) => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      items: undefined,
    };
  }

  try {
    const activeFamilyId = await getActiveFamilyId();
    const user = await prisma.user.findFirst({
      where: {
        familyMemberships: {
          some: {
            id: memberId,
          },
        },
      },
    });
    if (!user) {
      return {
        success: false,
        message: `Can't find this person/`,
        items: undefined,
      };
    }
    const lists = await prisma.list.findMany({
      where: {
        user: {
          id: user.id,
        },
        visibleTo: {
          some: {
            id: activeFamilyId,
          },
        },
      },
      include: {
        visibleTo: true,
        items: {
          include: {
            member: true,
            boughtBy: true,
            list: true,
          },
        },
      },
    });

    const items = lists.reduce((acc: ItemWithRefs[], list: ListWithItems) => {
      return [...acc, ...list.items];
    }, []);

    return {
      success: true,
      message: '',
      items,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      items: undefined,
    };
  }
});

export const boughtCount = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      items: undefined,
      bought: undefined,
    };
  }

  const me = await getActiveMember();
  if (!me) {
    return {
      success: false,
      message: `Can't figure out who you are for some reason.`,
      items: undefined,
      bought: undefined,
    };
  }
  const items = await prisma.item.count({
    where: {
      member: {
        id: me?.id,
      },
    },
  });
  const bought = await prisma.item.count({
    where: {
      member: {
        id: me?.id,
      },
      NOT: {
        boughtBy: {
          none: {},
        },
      },
    },
  });

  return {
    success: true,
    message: '',
    items,
    bought,
  };
});
