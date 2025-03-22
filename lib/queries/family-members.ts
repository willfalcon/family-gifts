import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { FamilyMemberWithRefs, FamilyMemberWithUser } from '@/prisma/types';
import { Family, User } from '@prisma/client';
import { cache } from 'react';
import { getActiveFamilyId } from '../rscUtils';

type GetMembersResult = {
  success: boolean;
  message: string;
  members: User[];
};

/**
 * Get limit or 4 members of currently active family.
 * @param {number | undefined} limit
 * @returns {MemberWithUser}
 */

export const getSomeMembers = cache(async (limit: number | undefined, skip?: number | undefined) => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      members: [],
      count: 0,
    };
  }

  const activeFamilyId = await getActiveFamilyId();
  try {
    const members = await prisma.user.findMany({
      where: {
        families: {
          some: {
            id: activeFamilyId,
          },
        },
      },
      include: {
        managing: true,

        _count: {
          select: {
            lists: {
              where: {
                visibleTo: {
                  some: {
                    id: activeFamilyId,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      ...(limit &&
        limit >= 0 && {
          take: limit ?? 4,
        }),
      skip: skip ?? 0,
    });
    const count = await prisma.user.count({
      where: {
        families: {
          some: {
            id: activeFamilyId,
          },
        },
      },
    });
    if (members) {
      return {
        success: true,
        members,
        message: '',
        count,
      };
    } else {
      return { success: false, members: [], message: `Couldn't find any members.`, count: 0 };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      members: [],
      message: 'Something went wrong.',
      count: 0,
    };
  }
});

export const getMembers = cache(async (id: Family['id'], limit?: number | undefined): Promise<GetMembersResult> => {
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
        ...(limit && {
          take: limit,
        }),
      },
      managers: true,
    },
  });

  if (!family) {
    return {
      success: false,
      message: 'Family not found.',
      members: [],
    };
  }

  // am i a member or a manager of the family?
  if (family?.members.find((member) => member.id === session.user!.id || family.managers.find((user) => user.id === session.user!.id))) {
    return {
      success: true,
      members: family.members || [],
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

type FamilyMemberListsResult = {
  success: boolean;
  message: string;
  lists: FamilyMemberWithRefs[];
};

/**
 * Retrieves a list of family members and their lists for the active family, excluding the current user.
 */
export const getFamilyMembers = cache(async (): Promise<FamilyMemberListsResult> => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      lists: [],
    };
  }
  const activeFamilyId = await getActiveFamilyId();

  if (!activeFamilyId) {
    return {
      success: false,
      message: 'You must be in a family to do this.',
      lists: [],
    };
  }
  try {
    const me = await getActiveMember();
    if (!me) {
      return {
        success: false,
        message: 'You must be in this family to see its members.',
        lists: [],
      };
    }
    const members = await prisma.user.findMany({
      where: {
        families: {
          some: {
            id: activeFamilyId,
          },
        },
        NOT: {
          id: me.id,
        },
      },
      include: {
        lists: true,
      },
    });

    if (members) {
      return {
        success: true,
        lists: members,
        message: '',
      };
    } else {
      return {
        success: false,
        message: "Couldn't find any member lists.",
        lists: [],
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      lists: [],
    };
  }
});

/**
 * Returns the active logged-in family member
 */
export const getFamilyMember = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      member: null,
    };
  }

  const activeFamilyId = await getActiveFamilyId();

  try {
    const member = await prisma.user.findFirst({
      where: {
        id: session.user.id,

        ...(activeFamilyId && {
          families: {
            some: {
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
        message: '',
      };
    } else {
      return {
        success: false,
        message: `Couldn't find family member.`,
        member: null,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      member: null,
    };
  }
});

/**
 * Retrieves the family member along with their user
 */
export const getFamilyMemberById = cache(async (id: User['id']) => {
  const session = await auth();
  if (!session?.user) {
    return {
      error: 'Not logged in',
      message: 'You must be logged in to do this.',
      member: null,
    };
  }

  try {
    const activeFamilyId = await getActiveFamilyId();
    const member = await prisma.user.findFirst({
      where: {
        id,
      },
      include: {
        families: {
          where: {
            id: activeFamilyId,
          },
        },
      },
    });

    if (member) {
      return {
        success: true,
        member,
        message: '',
      };
    } else {
      return {
        success: false,
        message: `Couldn't find family member.`,
        member: null,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      member: null,
    };
  }
});

/**
 * Returns the user for a family member
 */
export const getMemberUser = cache(async (member: User) => {
  if (!member.id) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: {
      id: member.id,
    },
  });
  return user;
});

/**
 * returns the number of members in the user's current active family
 */
export const getFamilyMemberCount = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
    };
  }
  const activeFamilyId = await getActiveFamilyId();

  try {
    const count = await prisma.user.count({
      where: {
        families: {
          some: {
            id: activeFamilyId,
          },
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

/**
 * Get currently logged in member for the active family
 */
export const getActiveMember = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const activeFamilyId = await getActiveFamilyId();
  const me = await prisma.user.findFirst({
    where: {
      id: session?.user.id,

      families: {
        some: {
          id: activeFamilyId,
          members: {
            some: {
              id: session?.user.id,
            },
          },
        },
      },
    },
  });
  return me;
});

/**
 * Get currently logged in member (with user) for the active family
 */
export const getActiveMemberUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const activeFamilyId = await getActiveFamilyId();
  const me = await prisma.user.findFirst({
    where: {
      id: session?.user.id,

      families: {
        some: {
          id: activeFamilyId,
          members: {
            some: {
              id: session?.user.id,
            },
          },
        },
      },
    },
    include: {
      managing: true,
    },
  });
  return me;
});

/**
 * Get currently logged in member (with all relations) for the active family
 */
export const getActiveMemberAll = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const activeFamilyId = await getActiveFamilyId();
  const me = await prisma.user.findFirst({
    where: {
      id: session?.user.id,

      families: {
        some: {
          id: activeFamilyId,
          members: {
            some: {
              id: session?.user.id,
            },
          },
        },
      },
    },
    include: {
      managing: true,
      giving: {
        include: {
          recipient: true,
        },
      },
    },
  });
  return me;
});
/**
 * Get currently logged in member (with user) for the active family
 */
export const getActiveMemberUserAssignments = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const activeFamilyId = await getActiveFamilyId();
  const me = await prisma.user.findFirst({
    where: {
      id: session?.user.id,

      families: {
        some: {
          id: activeFamilyId,
          members: {
            some: {
              id: session?.user.id,
            },
          },
        },
      },
    },
    include: {
      managing: true,
      giving: {
        include: {
          recipient: true,
        },
      },
    },
  });
  return me;
});

export const getMemberAssignment = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const activeFamilyId = await getActiveFamilyId();
  const me = await prisma.user.findFirst({
    where: {
      id: session?.user.id,

      families: {
        some: {
          id: activeFamilyId,
          members: {
            some: {
              id: session?.user.id,
            },
          },
        },
      },
    },
    include: {
      giving: {
        include: {
          recipient: true,
        },
      },
    },
  });
  return me;
});
