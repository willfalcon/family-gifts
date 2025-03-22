import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { cache } from 'react';
import { getActiveFamilyId } from '../rscUtils';
import { Family, Prisma } from '@prisma/client';

export type MemberFromGetFamily = Prisma.UserGetPayload<{
  include: {
    events: {
      include: {
        _count: {
          select: {
            assignments: true;
          };
        };
        attendees: true;
      };
    };
    lists: {
      include: {
        _count: {
          select: {
            items: true;
          };
        };
      };
    };
    _count: {
      select: {
        lists: true;
      };
    };
  };
}>;

export type EventFromGetFamily = Prisma.EventGetPayload<{
  include: {
    _count: {
      select: {
        assignments: true;
      };
    };
    attendees: true;
  };
}>;

export type ListFromGetFamily = Prisma.ListGetPayload<{
  include: {
    _count: {
      select: {
        items: true;
      };
    };
  };
}>;

export type FamilyFromGetFamily = Prisma.FamilyGetPayload<{
  include: {
    managers: true;
    invites: true;
    members: {
      include: {
        events: {
          include: {
            _count: {
              select: {
                assignments: true;
              };
            };
            attendees: true;
          };
        };
        lists: {
          include: {
            _count: {
              select: {
                items: true;
              };
            };
          };
        };
        _count: {
          select: {
            lists: true;
          };
        };
      };
    };
    creator: true;
    _count: {
      select: {
        members: true;
      };
    };
  };
}>;

export const getFamily = cache(async (id: Family['id']) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this');
  }

  const family = await prisma.family.findUnique({
    where: {
      id,
    },
    include: {
      managers: true,
      invites: true,
      members: {
        include: {
          events: {
            include: {
              _count: {
                select: {
                  assignments: true,
                },
              },
              attendees: true,
            },
          },
          lists: {
            include: {
              _count: {
                select: {
                  items: true,
                },
              },
            },
          },
          _count: {
            select: {
              lists: true,
            },
          },
        },
      },
      creator: true,
      _count: {
        select: {
          members: true,
        },
      },
    },
  });

  if (!family) {
    throw new Error(`Couldn't find family.`);
  }

  return family;
});

export const oldGetFamily = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      family: null,
    };
  }

  try {
    const activeFamilyId = await getActiveFamilyId();
    if (!activeFamilyId) {
      return {
        success: false,
        message: `Make sure you're logged in and are in a family.`,
        family: null,
      };
    }
    const family = await prisma.family.findUnique({
      where: {
        id: activeFamilyId,
      },
      include: {
        managers: true,
        members: true,
      },
    });
    if (family) {
      return {
        success: true,
        message: '',
        family,
      };
    } else {
      return {
        success: false,
        message: `Couldn't find family.`,
        family: null,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      family: null,
    };
  }
});

/**
 * Get all families where user is a member.
 */
export const getFamilies = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to get families');
  }
  const families = await prisma.family.findMany({
    where: {
      members: {
        some: {
          id: session.user.id,
        },
      },
    },
    include: {
      managers: true,
      invites: true,
      members: {
        include: {
          events: {
            include: {
              _count: {
                select: {
                  assignments: true,
                },
              },
              attendees: true,
            },
          },
          lists: {
            include: {
              _count: {
                select: {
                  items: true,
                },
              },
            },
          },
          _count: {
            select: {
              lists: true,
            },
          },
        },
      },
      creator: true,
      _count: {
        select: {
          members: true,
        },
      },
    },
  });
  return families;
});
