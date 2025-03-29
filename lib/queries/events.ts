import { auth } from '@/auth';
import { cache } from 'react';
import { getActiveFamilyId } from '../rscUtils';
import { getActiveMember } from './family-members';
import { prisma } from '@/prisma';
import { addMonths } from 'date-fns';
import { Event, Prisma } from '@prisma/client';

/**
 * Gets all or some events for the current member of the current active family
 */
export const getEvents = cache(async (limit?: number, skip?: number) => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      events: [],
    };
  }

  try {
    const events = await prisma.event.findMany({
      where: {
        attendees: {
          some: {
            id: session.user.id,
          },
        },
        OR: [
          {
            date: {
              gte: new Date(),
            },
          },
          {
            date: null,
          },
        ],
      },
      include: {
        family: true,
      },
      take: limit || undefined,
      skip: skip ?? 0,
      orderBy: {
        date: 'asc',
      },
    });
    if (events.length) {
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

/**
 * Get all events for the current user regardless of family
 */
export const getAllEvents = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      events: [],
    };
  }
  try {
    const events = await prisma.event.findMany({
      where: {
        family: {
          members: {
            some: {
              user: {
                id: session.user.id,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
    if (events.length) {
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
/**
 * Get number of events for the current member over the next 6 months
 */
export const getEventsCount = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      count: undefined,
    };
  }

  const activeFamilyId = await getActiveFamilyId();
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
          gte: new Date(),
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

/**
 * Get an event by its id, if the user is logged in is in the family for the event and has the family active.
 */
export const getEvent = cache(async (id: Event['id']) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be logged in to do this.');
  }

  const event = await prisma.event.findUnique({
    where: {
      id,
      attendees: {
        some: {
          id: session.user.id,
        },
      },
    },
    include: {
      managers: true,
      attendees: {
        include: {
          managedEvents: true,
        },
      },
      assignments: {
        include: {
          giver: true,
          recipient: true,
        },
      },
      creator: true,
      invites: true,
    },
  });
  return event;
});

export type EventFromGetEvent = Prisma.EventGetPayload<{
  include: {
    managers: true;
    attendees: {
      include: {
        managedEvents: true;
      };
    };
    assignments: {
      include: {
        giver: true;
        recipient: true;
      };
    };
    creator: true;
    invites: true;
  };
}>;
