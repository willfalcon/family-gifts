import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { FamilyMemberWithRefs, FamilyMemberWithUser } from '@/prisma/types';
import { Family, FamilyMember } from '@prisma/client';
import { cache } from 'react';
import { getActiveFamilyId } from '../rscUtils';

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

type FamilyMemberListsResult = {
  success: boolean;
  message: string;
  lists: FamilyMemberWithRefs[];
};
export const getFamilyMemberLists = cache(async (): Promise<FamilyMemberListsResult> => {
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
    const members = await prisma.familyMember.findMany({
      where: {
        familyId: activeFamilyId,
        NOT: {
          id: me.id,
        },
      },
      include: {
        items: true,
        user: true,
      },
    });
    // const lists = await prisma.family.findFirst({
    //   where: {
    //     id: activeFamilyId,
    //   },
    //   select: {
    //     members: {
    //       select: {
    //         name: true,
    //         id: true,
    //         items: {
    //           where: {
    //             member: {
    //               user: {
    //                 id: {
    //                   not: session.user.id,
    //                 },
    //               },
    //             },
    //           },
    //         },
    //         user: true,
    //       },
    //     },
    //   },
    // });

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

export const getFamilyMember = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      error: 'Not logged in',
      message: 'You must be logged in to do this.',
      families: [],
    };
  }

  const activeFamilyId = await getActiveFamilyId();

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

  const activeFamilyId = await getActiveFamilyId();
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
