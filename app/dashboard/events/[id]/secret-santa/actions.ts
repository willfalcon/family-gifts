'use server';

import { auth } from '@/auth';
import { prisma } from '@/prisma';

import { api } from '@/convex/_generated/api';
import secretSantaNotification from '@/emails/secretSanta';
import { GetEvent, getEvent } from '@/lib/queries/events';
import { User } from '@prisma/client';
import { ConvexHttpClient } from 'convex/browser';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import { Assignment, Exclusion } from './store';

export async function updateSecretSanta(eventId: string, assignments: Assignment[], exclusions: Exclusion[], budget: string) {
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
      secretSantaBudget: budget,
      notificationsSent: false,
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

  revalidatePath(`/dashboard/events/${eventId}`);

  return updatedEvent;
}

export async function sendSecretSantaNotifications(eventId: string) {
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

  const assignments = event.assignments;

  await Promise.all(
    assignments.map(async (assignment) => {
      const giver = assignment.giver;
      const recipient = assignment.recipient;

      if (!giver || !recipient) {
        return;
      }

      await sendAssignmentEmail(event, giver, recipient);
      await sendAssignmentNotification(event, giver);
    }),
  );
  await prisma.event.update({
    where: { id: eventId },
    data: {
      notificationsSent: true,
    },
  });
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendAssignmentEmail(event: GetEvent, giver: User, recipient: User) {
  const { data, error } = await resend.emails.send({
    from: `Secret Santa <${process.env.FROM_EMAIL_ADDRESS}>`,
    to: [giver.email!],
    subject: `You have a secret santa assignment!`,
    react: secretSantaNotification({ recipient, event }),
  });
  if (error) {
    console.error('sendAssignmentEmail:', error);
    throw new Error(`Couldn't send email.`);
  }
  return data;
}

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
async function sendAssignmentNotification(event: GetEvent, giver: User) {
  await client.mutation(api.notifications.createNotification, {
    userId: giver.id!,
    type: 'info',
    title: `You have a secret santa assignment!`,
    message: `View your assignment on the event page.`,
    link: `/dashboard/events/${event.id}`,
  });
}
