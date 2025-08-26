'use server';

import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { EventResponse, Prisma } from '@prisma/client';

import { getEvent as getEventQuery } from '@/lib/queries/events';
import { getListInclude } from '@/lib/queries/items';

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
    include: participantInclude,
  });
  return invite;
}

const participantInclude = {
  user: {
    include: {
      managedEvents: true,
    },
  },
};

export type GetParticipant = Prisma.InviteGetPayload<{
  include: {
    user: {
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

  if (!session.user.id) {
    throw new Error('Session error. Try logging out and in again.');
  }

  if (!userId) {
    throw new Error('User not found.');
  }

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      managers: true,
    },
  });

  if (!event) {
    throw new Error('Event not found.');
  }

  if (!event.managers.some((manager) => manager.id === session.user?.id)) {
    throw new Error('You must be a manager to add a manager to this event.');
  }

  const updatedEvent = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      managers: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return updatedEvent;
}

export async function removeManager(eventId: string, userId: string | undefined) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  if (!session.user?.id) {
    throw new Error('Session error. Try logging out and in again.');
  }

  if (!userId) {
    throw new Error('User not found.');
  }

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      managers: true,
    },
  });

  if (!event) {
    throw new Error('Event not found.');
  }

  if (!event.managers.some((manager) => manager.id === session.user?.id)) {
    throw new Error('You are not a manager of this event.');
  }

  if (event.managers.length === 1) {
    throw new Error('You cannot remove the last manager from this event.');
  }

  const updatedEvent = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      managers: {
        disconnect: {
          id: userId,
        },
      },
    },
  });
  return updatedEvent;
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
    include: getListInclude,
  });
  return lists;
}

export async function removeParticipant(eventId: string, inviteId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }
  if (!session.user.id) {
    throw new Error('Session error. Try logging out and in again.');
  }

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
    throw new Error('Event not found.');
  }

  if (!event.managers.some((manager) => manager.id === session.user?.id)) {
    throw new Error('You must be a manager to remove a participant from this event.');
  }

  if (!event.attendees.length) {
    throw new Error(`You can't remove the last participant from this event. Just delete the event instead.`);
  }

  const participant = await prisma.user.findFirst({
    where: {
      eventInvite: {
        some: {
          id: inviteId,
        },
      },
    },
  });

  if (!participant) {
    throw new Error('Participant not found.');
  }

  await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      attendees: {
        disconnect: {
          id: participant.id,
        },
      },
    },
  });

  await prisma.invite.delete({
    where: {
      id: inviteId,
    },
  });
}

export async function removeInvite(eventId: string, inviteId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }
  if (!session.user.id) {
    throw new Error('Session error. Try logging out and in again.');
  }

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      managers: true,
    },
  });

  if (!event) {
    throw new Error('Event not found.');
  }

  if (!event.managers.some((manager) => manager.id === session.user?.id)) {
    throw new Error('You must be a manager to remove an invite from this event.');
  }

  await prisma.invite.delete({
    where: {
      id: inviteId,
    },
  });
}
