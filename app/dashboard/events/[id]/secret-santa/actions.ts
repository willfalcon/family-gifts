'use server';

import { auth } from '@/auth';
import { prisma } from '@/prisma';

import { getEvent } from '@/lib/queries/events';
import { Assignment, Exclusion } from './store';

export async function updateSecretSanta(eventId: string, assignments: Assignment[], exclusions: Exclusion[]) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const event = await getEvent(eventId);

  if (!event) {
    throw new Error('Event not found.');
  }

  if (!event.managers.some((manager) => manager.id === session.user?.id)) {
    throw new Error('You are not authorized to do this.');
  }

  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: {
      assignments: {
        ...(event.assignments.length > 0 && {
          deleteMany: event.assignments.map((assignment) => ({ id: assignment.id })),
        }),
        create: assignments
          .filter((assignment) => assignment.giver && assignment.recipient)
          .map((assignment) => ({
            giver: {
              connect: {
                id: assignment.giver!.id,
              },
            },
            recipient: {
              connect: {
                id: assignment.recipient!.id,
              },
            },
          })),
      },
      exclusions: {
        ...(event.exclusions.length > 0 && {
          deleteMany: event.exclusions.map((exclusion) => ({ id: exclusion.id })),
        }),
        create: exclusions
          .filter((exclusion) => exclusion.from && exclusion.to)
          .map((exclusion) => ({
            from: {
              connect: {
                id: exclusion.from!.id,
              },
            },
            to: {
              connect: {
                id: exclusion.to!.id,
              },
            },
          })),
      },
    },
  });

  return updatedEvent;
}
