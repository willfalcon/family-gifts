import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { Family, Prisma } from '@prisma/client';
import { cache } from 'react';

import { getActiveFamilyId } from '../rscUtils';
import { getListInclude } from './items';

export type MemberFromGetFamily = Prisma.UserGetPayload<{
  include: {
    lists: {
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

export type GetFamily = Prisma.FamilyGetPayload<{
  include: {
    managers: true;
    invites: {
      include: {
        user: true;
      };
    };
    creator: true;
    members: {
      include: {
        lists: {
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
        };
        _count: {
          select: {
            lists: true;
          };
        };
      };
    };
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
    _count: {
      select: {
        members: true;
      };
    };
  };
}>;

export const getFamilyInclude = (id: Family['id']) => ({
  managers: true,
  invites: {
    include: {
      user: true,
    },
  },
  creator: true,
  members: {
    orderBy: {
      createdAt: Prisma.SortOrder.asc,
    },
    include: {
      lists: {
        where: {
          visibleToFamilies: {
            some: {
              id,
            },
          },
        },
        include: getListInclude,
      },
      _count: {
        select: {
          lists: true,
        },
      },
    },
  },
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
  _count: {
    select: {
      members: true,
    },
  },
});

export const getFamily = cache(async (id: Family['id']): Promise<GetFamily> => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this');
  }

  // TODO: find a way to order by date added to family
  const family = await prisma.family.findUnique({
    where: {
      id,
    },
    include: getFamilyInclude(id),
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

export type GetFamilies = Prisma.FamilyGetPayload<{
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

export type FamilyFromGetFamilies = GetFamilies;
/**
 * Get all families where user is a member plus initial 3 members - for dashboard use.
 */
export const dashboardGetFamilies = cache(async () => {
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
          managing: true,
          _count: {
            select: {
              lists: true,
            },
          },
        },
        take: 3,
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

export type FamilyFromDashboardGetFamilies = Prisma.FamilyGetPayload<{
  include: {
    managers: true;
    invites: true;
    members: {
      include: {
        managing: true;
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

export type MemberFromDashboardGetFamilies = Prisma.UserGetPayload<{
  include: {
    managing: true;
    _count: {
      select: {
        lists: true;
      };
    };
  };
}>;
