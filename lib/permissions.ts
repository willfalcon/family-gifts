import { prisma } from '@/prisma';
import { cache } from 'react';

import { auth } from '@/auth';
import { GetList } from './queries/items';

export const canViewEvent = cache(async (eventId: string, userId: string) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      managers: true,
      attendees: true,
    },
  });

  if (!event) {
    throw new Error(`Can't get viewing permissions because event doesn't exist.`);
  }

  if (event.creatorId === userId) {
    return true;
  }

  if (event.managers.some((manager) => manager.id === userId)) {
    return true;
  }

  if (event.attendees.some((attendee) => attendee.id === userId)) {
    return true;
  }

  return false;
});

export const canManageFamily = cache(async (familyId: string, userId: string) => {
  const family = await prisma.family.findUnique({
    where: { id: familyId },
    include: { managers: true, members: true },
  });

  if (!family) {
    throw new Error(`Can't get managing permissions because family doesn't exist.`);
  }

  if (family.allowInvites && family.members.some((member) => member.id === userId)) {
    return true;
  }
  if (family.creatorId === userId) {
    return true;
  }
  if (family.managers.some((manager) => manager.id === userId)) {
    return true;
  }
  return false;
});

export const canViewList = cache(async (list: GetList) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be logged in to do this.');
  }
  if (!list) {
    throw new Error(`Can't get viewing permissions because list doesn't exist.`);
  }
  if (list.visibleToUsers.some((user) => user.id === session.user?.id)) {
    return true;
  }
  if (list.visibleToFamilies.some((family) => family.members.some((member) => member.id === session.user?.id))) {
    return true;
  }
  if (list.visibleToEvents.some((event) => event.attendees.some((attendee) => attendee.id === session.user?.id))) {
    return true;
  }
  return false;
});
