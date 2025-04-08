'use server';

import { auth } from '@/auth';
import { EventResponse, Prisma } from '@prisma/client';
import { prisma } from '@/prisma';
import { revalidatePath } from 'next/cache';
// import { AssignmentsType } from './SecretSanta/secretSantaStore';
import { getActiveFamilyId } from '@/lib/rscUtils';
// import { Resend } from 'resend';
// import secretSantaNotification from '@/emails/secretSanta';
import { getEvent as getEventQuery } from '@/lib/queries/events';

export async function getEvent(id: string) {
  return await getEventQuery(id);
}

export async function getEventAttendance(inviteId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }
  const invite = await prisma.invite.findUnique({
    where: {
      id: inviteId,
      userId: session.user.id,
    },
  });
  return invite?.eventResponse;
}

export async function updateEventAttendance(inviteId: string, response: EventResponse) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }
  const invite = await prisma.invite.update({
    where: {
      id: inviteId,
      userId: session.user.id,
    },
    data: { eventResponse: response },
  });
  if (!invite) {
    throw new Error('Invite not found.');
  }
  return invite;
}

export async function getParticipant(inviteId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }
  const invite = await prisma.invite.findUnique({
    where: {
      id: inviteId,
    },
    include: {
      user: {
        include: {
          managedEvents: true,
        },
      },
    },
  });
  return invite;
}

export type GetParticipant = Prisma.InviteGetPayload<{
  include: {
    user?: {
      include: {
        managedEvents: true;
      };
    };
  };
}>;

export async function addManager(eventId: string, userId: string | undefined) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  if (!userId) {
    throw new Error('User not found.');
  }

  const event = await prisma.event.update({
    where: {
      id: eventId,
      managers: {
        some: {
          id: session.user.id,
        },
      },
    },
    data: {
      managers: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return event;
}

export async function removeManager(eventId: string, userId: string | undefined) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  if (!userId) {
    throw new Error('User not found.');
  }

  const event = await prisma.event.update({
    where: {
      id: eventId,
      managers: {
        some: {
          id: session.user.id,
        },
      },
    },
    data: {
      managers: {
        disconnect: {
          id: userId,
        },
      },
    },
  });
  return event;
}

export async function getListsByEvent(eventId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      attendees: true,
    },
  });

  if (!event) {
    throw new Error('Event not found.');
  }

  if (!event.attendees.some((attendee) => attendee.id === session.user?.id)) {
    throw new Error('You are not a participant in this event.');
  }

  const lists = await prisma.list.findMany({
    where: {
      visibleToEvents: {
        some: {
          id: eventId,
        },
      },
    },
    include: {
      _count: {
        select: {
          items: true,
        },
      },
    },
  });
  return lists;
}
