import { prisma } from '@/prisma';
import { cache } from 'react';

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
