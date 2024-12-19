import { auth } from '@/auth';
import { cache } from 'react';
import { getActiveFamilyId } from '../rscUtils';
import { getActiveMember } from './family-members';
import { prisma } from '@/prisma';
import { addMonths } from 'date-fns';
import { Event } from '@prisma/client';

export const getEvents = cache(async (limit?: number) => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      events: [],
    };
  }

  const activeFamilyId = await getActiveFamilyId();
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
        managers: true,
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
