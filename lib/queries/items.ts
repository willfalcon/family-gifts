import { auth } from '@/auth';
import { cache } from 'react';
import { getActiveFamilyId } from '../rscUtils';
import { prisma } from '@/prisma';
import { getActiveMember } from './family-members';
import { FamilyMember, List } from '@prisma/client';
import { ItemWithRefs, ListWithItems } from '@/prisma/types';

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
export const getListById = cache(async (id: List['id']) => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      list: undefined,
    };
  }

  try {
    const activeFamilyId = await getActiveFamilyId();
    const list = await prisma.list.findFirst({
      where: {
        id,
        OR: [
          {
            user: {
              id: session.user.id,
            },
          },
          {
            visibleTo: {
              some: {
                id: activeFamilyId,
              },
            },
          },
        ],
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

export const getList = cache(async (id: FamilyMember['id']) => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      list: null,
    };
  }

  // Find this family member
  const member = await prisma.familyMember.findUnique({
    where: { id },
    include: { family: { include: { members: true } }, items: { include: { member: true, boughtBy: true } } },
  });
  if (!member) {
    return {
      success: false,
      message: `Couldn't find family member.`,
      list: null,
    };
  }
  const activeFamilyId = await getActiveFamilyId();

  // Find the current user's Member which is in the same family as the requested member.
  const me = await prisma.familyMember.findFirst({
    where: {
      user: {
        id: session.user.id,
      },
      family: {
        id: activeFamilyId,
        members: {
          some: {
            id,
          },
        },
      },
    },
  });

  if (!me) {
    return {
      success: false,
      message: `This list isn't visible to you! Make sure you've got the right family selected.`,
      list: null,
    };
  }

  if (me.id === id) {
    return {
      success: false,
      message: `You can't look at your own list this way!`,
      list: null,
    };
  }

  return {
    success: true,
    list: member.items,
    message: '',
  };
});
