'use server';

import { auth } from '@/auth';
import { EventSchema, EventSchemaType, EventDetailsSchema, EventDetailsSchemaType, EventAttendeesSchemaType } from './eventSchema';
import { getActiveFamilyId } from '@/lib/rscUtils';
import { prisma } from '@/prisma';
import { revalidatePath } from 'next/cache';
import { JSONContent } from '@tiptap/react';
import { Event, Invite } from '@prisma/client';
import { getActiveMember, getFamilyMembers } from '@/lib/queries/family-members';
import { api } from '@/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';
import { randomBytes } from 'crypto';
import { addDays } from 'date-fns';
import { Resend } from 'resend';
import EventInviteEmailTemplate from '@/emails/eventEnvite';
import { redirect } from 'next/navigation';
import { getEvent } from '@/lib/queries/events';

export async function createEvent(event: EventSchemaType) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this!');
  }

  const validatedData = EventSchema.parse(event);

  const { attendees, externalInvites, ...fields } = validatedData;

  const knownInvitees = await prisma.user.findMany({
    where: {
      id: {
        in: attendees,
      },
    },
  });

  // Create the event
  // Send invites to known users/family members
  // Send invites to unknown users

  // SHould they be handled differently?
  // They all need to have the invite sent, which can happen in the create event step.
  // Then they all need emails sent.
  // They should all get a "Join Event" button with a token to join the event.
  // In-app notifications can be handled after?
  const knownInvites = knownInvitees.map((user) => {
    const token = randomBytes(20).toString('hex');
    const tokenExpiry = addDays(new Date(), 30);
    return {
      user: {
        // Go ahead and connect theses users to the invites
        connect: {
          id: user.id,
        },
      },
      // If the user is the creator, they are automatically accepted
      ...(user.id === session.user?.id && { eventResponse: 'accepted' }),
      email: user.email,
      token,
      tokenExpiry,
      inviter: {
        connect: {
          id: session.user?.id,
        },
      },
    };
  });

  const unknownInvites = externalInvites.map((invite) => {
    const token = randomBytes(20).toString('hex');
    const tokenExpiry = addDays(new Date(), 30);
    // create invites for the unknown users
    return {
      email: invite,
      token,
      tokenExpiry,
      inviter: {
        connect: {
          id: session.user?.id,
        },
      },
    };
  });

  const newEvent = await prisma.event.create({
    data: {
      ...fields,
      info: validatedData.info as JSONContent,
      invites: {
        create: [...knownInvites, ...unknownInvites],
      },
      attendees: {
        connect: {
          id: session.user?.id,
        },
      },
      creator: {
        connect: {
          id: session.user?.id,
        },
      },
    },
    include: {
      invites: true,
    },
  });
  if (newEvent) {
    // Create a new messages channel for the event in Convex
    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    const channel = await client.mutation(api.channels.createChannel, {
      name: validatedData.name,
      type: 'event',
      event: newEvent.id,
      users: [session.user.id!, ...knownInvitees.map((i) => i.id)],
      messages: [],
    });

    // Add the channel id to the event
    await prisma.event.update({
      where: {
        id: newEvent.id,
      },
      data: {
        eventChannel: channel,
      },
    });

    // Send invites to all invites (except the creator)
    const invitesToSend = newEvent.invites.filter((invite) => invite.userId !== session.user?.id);
    await Promise.all(invitesToSend.map((invite) => sendInviteEmail(invite, newEvent)));

    revalidatePath('/dashboard/events');
    return newEvent;
  } else {
    throw new Error(`Couldn't create event.`);
  }
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInviteEmail(invite: Invite, event: Event) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Invite <${process.env.FROM_EMAIL_ADDRESS}>`,
      to: [invite.email],
      subject: `You're invited to an event!`,
      react: EventInviteEmailTemplate(invite, event),
    });
    if (error) {
      console.error('sendInviteEmail:', error);
      throw new Error(`Couldn't send email.`);
    }
    return data;
  } catch (error) {
    console.error('sendInviteEmail:', error);
    throw new Error(`Something went wrong sending email.`);
  }
}

export async function updateEventDetails(id: Event['id'], event: EventDetailsSchemaType) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this!');
  }
  const currentEvent = await getEvent(id);
  if (!currentEvent) {
    throw new Error('Event not found');
  }
  if (currentEvent.creatorId !== session.user.id) {
    throw new Error('You are not authorized to edit this event');
  }

  const validatedData = EventDetailsSchema.parse(event);

  try {
    const updatedEvent = await prisma.event.update({
      where: {
        id,
      },
      data: {
        ...validatedData,
        info: validatedData.info as JSONContent,
      },
    });
    if (updatedEvent) {
      revalidatePath(`/dashboard/event/${updatedEvent.id}`);
      return updatedEvent;
    } else {
      throw new Error("Couldn't update event.");
    }
  } catch (err) {
    console.error(err);
    throw new Error('Something went wrong.');
  }
}

export async function updateEventAttendees(id: Event['id'], attendees: EventAttendeesSchemaType) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this!');
  }
  const currentEvent = await getEvent(id);
  if (!currentEvent) {
    throw new Error('Event not found');
  }
  if (currentEvent.creatorId !== session.user.id) {
    throw new Error('You are not authorized to edit this event');
  }

  // get the users for all in the attendees list that aren't already in the event
  const knownInvitees = await prisma.user.findMany({
    where: {
      id: {
        in: attendees.attendees.filter((attendee) => !currentEvent.attendees.some((a) => a.id === attendee)),
      },
    },
  });

  // create invites for the known users
  const newKnownInvites = knownInvitees.map((user) => {
    const token = randomBytes(20).toString('hex');
    const tokenExpiry = addDays(new Date(), 30);
    return {
      user: {
        // Go ahead and connect theses users to the invites
        connect: {
          id: user.id,
        },
      },
      // If the user is the creator, they are automatically accepted
      ...(user.id === session.user?.id && { eventResponse: 'accepted' }),
      email: user.email,
      token,
      tokenExpiry,
      inviter: {
        connect: {
          id: session.user?.id,
        },
      },
    };
  });
  const newExternalInvites = attendees.externalInvites
    .filter((invite) => !currentEvent.invites.some((i) => i.email === invite))
    .map((invite) => {
      const token = randomBytes(20).toString('hex');
      const tokenExpiry = addDays(new Date(), 30);
      // create invites for the unknown users
      return {
        email: invite,
        token,
        tokenExpiry,
        inviter: {
          connect: {
            id: session.user?.id,
          },
        },
      };
    });

  const updatedEvent = await prisma.event.update({
    where: { id },
    data: {
      invites: {
        create: [...newKnownInvites, ...newExternalInvites],
      },
    },
    include: {
      invites: true,
    },
  });

  if (updatedEvent) {
    // get the invites that weren't already in the invites list. (attendees already accepted were already filtered out of the newKnownInvites)
    const invitesToSend = updatedEvent.invites.filter((invite) => !currentEvent.invites.some((i) => i.id === invite.id));
    await Promise.all(invitesToSend.map((invite) => sendInviteEmail(invite, updatedEvent)));

    revalidatePath(`/dashboard/event/${updatedEvent.id}`);
    return updatedEvent;
  } else {
    throw new Error("Couldn't update event.");
  }
}
