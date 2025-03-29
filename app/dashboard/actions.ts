'use server';

import { auth } from '@/auth';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { getEvents, getEventsCount } from '@/lib/queries/events';
import { getSomeMembers } from '@/lib/queries/family-members';
import { prisma } from '@/prisma';
import { ConvexHttpClient } from 'convex/browser';
import { revalidatePath } from 'next/cache';

export async function reloadDashboard() {
  revalidatePath('/dashboard');
}

export async function dashboardGetMembers(getRest = false) {
  try {
    if (getRest) {
      const { success, members, message } = await getSomeMembers(-1, 2);
      if (success) {
        return members;
      } else {
        throw new Error(message);
      }
    } else {
      const { success, members, message } = await getSomeMembers(3);
      if (success) {
        return members;
      } else {
        throw new Error(message);
      }
    }
  } catch (err) {
    throw new Error('Something went wrong.');
  }
}

export async function dashboardGetMoreMembers(familyId: string, getRest: boolean) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const family = getRest
    ? await prisma.family.findUnique({
        where: {
          id: familyId,
        },
        include: {
          members: {
            include: {
              managing: true,
              _count: {
                select: {
                  lists: true,
                },
              },
            },
            skip: 3,
          },
        },
      })
    : await prisma.family.findUnique({
        where: {
          id: familyId,
        },
        include: {
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
        },
      });

  if (!family) {
    throw new Error('Family not found.');
  }

  return family.members;
}

export async function dashboardGetEvents(getRest = false) {
  try {
    const { count } = await getEventsCount();
    if (getRest) {
      const { success, events, message } = await getEvents(-1, 2);
      if (success) {
        return {
          events,
          total: count,
        };
      } else {
        throw new Error(message);
      }
    } else {
      const { success, events, message } = await getEvents(3);
      if (success) {
        return { events, total: count };
      } else {
        throw new Error(message);
      }
    }
  } catch (err) {
    throw new Error('Something went wrong.');
  }
}

const httpClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function markNotificationAsRead(notificationId: Doc<'notifications'>['_id']) {
  console.log('starting server fn');
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }
  console.log('got past auth check');
  await httpClient.mutation(api.notifications.markNotificationAsRead, {
    notificationId,
  });
  console.log('got past mutation');
}
