import { auth } from '@/auth';
import { getActiveFamilyId } from '@/lib/rscUtils';
import { prisma } from '@/prisma';
import { Event, Family, FamilyMember } from '@prisma/client';
import { addMonths } from 'date-fns';
import { cache } from 'react';
import { FamilyMemberWithUser } from './types';

export const getItems = cache(async (limit?: number) => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      items: undefined,
    };
  }

  const activeFamilyId = getActiveFamilyId();

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

export const getFamilies = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      families: [],
    };
  }
  const families = await prisma.family.findMany({
    where: {
      members: {
        some: {
          user: {
            id: session.user.id,
          },
        },
      },
    },
  });
  return {
    success: true,
    families,
    message: '',
  };
});

type GetMembersResult = {
  success: boolean;
  message: string;
  members: FamilyMemberWithUser[];
};

export const getMembers = cache(async (id: Family['id']): Promise<GetMembersResult> => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      members: [],
    };
  }
  const family = await prisma.family.findUnique({
    where: {
      id,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!family) {
    return {
      success: false,
      message: 'Family not found.',
      members: [],
    };
  }

  if (family?.members.find((member) => member.userId === session.user.id || family.managerId === session.user.id)) {
    return {
      success: true,
      members: family.members,
      message: '',
    };
  } else {
    return {
      success: false,
      message: 'You must be a member of this family.',
      members: [],
    };
  }
});

export const getInvitedMember = cache(async (token: string) => {
  const session = await auth();
  if (!session?.user) {
    return {
      error: 'Not logged in',
      message: 'You must be logged in to do this.',
      families: [],
    };
  }

  try {
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        inviteToken: token,
      },
      include: {
        family: true,
      },
    });
    if (familyMember) {
      return {
        success: true,
        familyMember,
      };
    } else {
      return {
        success: false,
        message: `Couldn't find matching member request for this token.`,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
    };
  }
});

export const getFamilyMember = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      error: 'Not logged in',
      message: 'You must be logged in to do this.',
      families: [],
    };
  }

  const activeFamilyId = getActiveFamilyId();

  try {
    const member = await prisma.familyMember.findFirst({
      where: {
        user: {
          is: {
            id: session.user.id,
          },
        },
        ...(activeFamilyId && {
          family: {
            is: {
              id: activeFamilyId,
            },
          },
        }),
      },
    });

    if (member) {
      return {
        success: true,
        member,
      };
    } else {
      return {
        success: false,
        message: `Couldn't find family member.`,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
    };
  }
});

export const getFamilyMemberById = cache(async (id: FamilyMember['id']) => {
  const session = await auth();
  if (!session?.user) {
    return {
      error: 'Not logged in',
      message: 'You must be logged in to do this.',
      families: [],
    };
  }

  try {
    const member = await prisma.familyMember.findFirst({
      where: {
        id,
      },
    });

    if (member) {
      return {
        success: true,
        member,
      };
    } else {
      return {
        success: false,
        message: `Couldn't find family member.`,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
    };
  }
});

export const getFamilyMemberLists = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
    };
  }
  const activeFamilyId = getActiveFamilyId();

  try {
    const lists = await prisma.family.findFirst({
      where: {
        ...(activeFamilyId
          ? {
              id: activeFamilyId,
            }
          : {
              members: {
                some: {
                  user: {
                    id: session.user.id,
                  },
                },
              },
            }),
      },
      select: {
        members: {
          select: {
            name: true,
            id: true,
            items: {
              where: {
                member: {
                  user: {
                    id: {
                      not: session.user.id,
                    },
                  },
                },
              },
            },
            user: true,
          },
        },
      },
    });

    if (lists) {
      return {
        success: true,
        lists: lists.members,
      };
    } else {
      return {
        success: false,
        message: "Couldn't find any member lists.",
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
    };
  }
});

export const getFamilyMemberCount = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
    };
  }
  const activeFamilyId = getActiveFamilyId();

  try {
    const count = await prisma.familyMember.count({
      where: {
        family: {
          id: activeFamilyId,
        },
      },
    });

    if (count) {
      return {
        success: true,
        count,
        message: '',
      };
    } else {
      return {
        success: false,
        message: "Couldn't find family members",
        count: undefined,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      count: undefined,
    };
  }
});

export const getActiveMember = cache(async () => {
  const session = await auth();

  const activeFamilyId = getActiveFamilyId();
  const me = await prisma.familyMember.findFirst({
    where: {
      user: {
        id: session?.user.id,
      },
      family: {
        id: activeFamilyId,
        members: {
          some: {
            user: {
              id: session?.user.id,
            },
          },
        },
      },
    },
  });
  return me;
});

export const getList = cache(async (id: FamilyMember['id']) => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
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
    };
  }
  const activeFamilyId = getActiveFamilyId();

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
      message: `You must be in a family with this person! Make sure you've got the right family selected.`,
    };
  }

  if (me.id === id) {
    return {
      success: false,
      message: `You can't look at your own list this way!`,
    };
  }

  return {
    success: true,
    list: member.items,
  };
});

export const getEvents = cache(async (limit?: number) => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      events: [],
    };
  }

  const activeFamilyId = getActiveFamilyId();
  try {
    const me = await getActiveMember();
    if (!me) {
      return {
        success: false,
        message: `Can't figure out who you are for some reason.`,
        events: [],
      };
    }
    const events = await prisma.event.findMany({
      where: {
        family: {
          id: activeFamilyId,
          members: {
            some: {
              id: me.id,
            },
          },
        },
      },
      take: limit || undefined,
      orderBy: {
        date: 'asc',
      },
    });
    if (events.length) {
      events.forEach((event) => {
        console.log(new Date(event.date || ''));
      });
      return {
        success: true,
        message: '',
        events: events.toSorted((a, b) => ((a.date?.getUTCDate() || '') > (b.date?.getUTCDate() || '') ? 1 : -1)),
      };
    } else {
      return {
        success: true,
        message: 'No events yet.',
        events: [],
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      events: [],
    };
  }
});

export const getEventsCount = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      count: undefined,
    };
  }

  const activeFamilyId = getActiveFamilyId();
  try {
    const me = await getActiveMember();
    if (!me) {
      return {
        success: false,
        message: `Can't figure out who you are for some reason.`,
        count: undefined,
      };
    }

    const count = await prisma.event.count({
      where: {
        family: {
          id: activeFamilyId,
        },
        date: {
          lte: addMonths(new Date(), 6),
        },
      },
    });

    return {
      success: true,
      message: '',
      count,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      count: undefined,
    };
  }
});

export const getEvent = cache(async (id: Event['id']) => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      events: [],
    };
  }
  try {
    const me = await getActiveMember();
    if (!me) {
      return {
        success: false,
        message: `Can't figure out who you are for some reason.`,
        events: [],
      };
    }
    const event = await prisma.event.findUnique({
      where: {
        id,
        family: {
          members: {
            some: {
              id: me.id,
            },
          },
        },
      },
      include: {
        assignments: {
          include: {
            giver: {
              include: {
                user: true,
              },
            },
            receiver: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    if (!event) {
      return {
        success: false,
        message: "Event doesn't exist",
        event: null,
      };
    }
    return {
      success: true,
      message: '',
      event,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      event: null,
    };
  }
});
