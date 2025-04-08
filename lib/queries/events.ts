import { auth } from '@/auth';
import { cache } from 'react';
import { prisma } from '@/prisma';
import { Event, Prisma } from '@prisma/client';

/**
 * Gets all or some upcoming events for the current member
 */
export const getEvents = cache(async (limit?: number, skip?: number) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to get events.');
  }

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
    take: limit || undefined,
    skip: skip ?? 0,
    orderBy: {
      date: 'asc',
    },
  });
  return events?.toSorted((a, b) => ((a.date?.getUTCDate() || '') > (b.date?.getUTCDate() || '') ? 1 : -1));
});

/**
 * Get number of upcoming events for the current member
 */
export const getEventsCount = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to get events.');
  }

  const count = await prisma.event.count({
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
  });

  return count;
});

/**
 * Get an event by its id, if the user is logged in and is a participant in the event
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
      exclusions: {
        include: {
          from: true,
          to: true,
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
    exclusions: {
      include: {
        from: true;
        to: true;
      };
    };
    creator: true;
    invites: true;
  };
}>;
