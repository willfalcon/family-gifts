'use server';

import { auth } from '@/auth';
import { api } from '@/convex/_generated/api';
import { prisma } from '@/prisma';
import { ConvexHttpClient } from 'convex/browser';

export async function joinFamily(token: string) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      updatedMember: null,
    };
  }

  const invite = await prisma.invite.findUnique({
    where: {
      token,
    },
  });

  if (!invite) {
    throw new Error(`Couldn't find your invite.`);
  }

  if (invite.tokenExpiry && invite.tokenExpiry < new Date()) {
    throw new Error('This invite has expired. Ask the family manager to send you a new one.');
  }
  if (!invite.familyId) {
    throw new Error(`FamilyId not attached to invite.`);
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        families: {
          connect: {
            id: invite.familyId,
          },
        },
      },
    });
    if (updatedUser) {
      // Add the user to the family channe
      const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

      await client.mutation(api.channels.addChannelUser, {
        family: invite.familyId,
        user: updatedUser.id!,
      });

      // Delete the invite
      await prisma.invite.delete({
        where: {
          id: invite.id,
        },
      });

      return { familyId: invite.familyId, userName: updatedUser.name };
    }

    throw new Error(`User not updated.`);
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong. 🤷‍♂️',
      updatedMember: null,
    };
  }
}

export async function joinEvent(token: string) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      updatedMember: null,
    };
  }

  const invite = await prisma.invite.findUnique({
    where: {
      token,
    },
  });

  if (!invite) {
    throw new Error(`Couldn't find your invite.`);
  }

  if (invite.tokenExpiry && invite.tokenExpiry < new Date()) {
    throw new Error('This invite has expired. Ask the event creator to send you a new one.');
  }
  if (!invite.eventId) {
    throw new Error(`EventId not attached to invite.`);
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        events: {
          connect: {
            id: invite.eventId,
          },
        },
      },
    });
    if (updatedUser) {
      // Add the user to the event channel
      const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

      await client.mutation(api.channels.addChannelUser, {
        event: invite.eventId,
        user: updatedUser.id!,
      });
      return { eventId: invite.eventId, userName: updatedUser.name };
    }

    throw new Error(`User not updated.`);
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong. 🤷‍♂️',
      updatedMember: null,
    };
  }
}
