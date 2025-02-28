'use server';

import { auth } from '@/auth';
import { EventSchema, EventSchemaType } from './eventSchema';
import { getActiveFamilyId } from '@/lib/rscUtils';
import { prisma } from '@/prisma';
import { revalidatePath } from 'next/cache';
import { JSONContent } from '@tiptap/react';
import { Event } from '@prisma/client';
import { getActiveMember, getFamilyMembers } from '@/lib/queries/family-members';
import { api } from '@/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

export async function createEvent(event: EventSchemaType) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      event: null,
    };
  }

  const validatedData = EventSchema.parse(event);

  const activeFamilyId = await getActiveFamilyId();

  if (!activeFamilyId) {
    return {
      success: false,
      message: 'Create a family first!',
      event: null,
    };
  }
  try {
    const newEvent = await prisma.event.create({
      data: {
        family: {
          connect: {
            id: activeFamilyId,
          },
        },
        ...validatedData,
        info: validatedData.info as JSONContent,
      },
    });
    if (newEvent) {
      // Create a new messages channel for the event in Convex
      const client = new ConvexHttpClient(process.env.CONVEX_URL!);
      const familyMembers = await getFamilyMembers();
      await client.mutation(api.channels.createChannel, {
        name: validatedData.name,
        type: 'event',
        event: newEvent.id,
        users: familyMembers.lists.map((member) => member.userId!),
        messages: [],
      });
      revalidatePath('/dashboard/events');
      return {
        success: true,
        message: '',
        event: newEvent,
      };
    } else {
      return {
        success: false,
        message: `Couldn't create event.`,
        event: null,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      event: null,
    };
  }
}

export async function updateEvent(id: Event['id'], event: EventSchemaType) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      event: null,
    };
  }

  const validatedData = EventSchema.parse(event);

  const activeFamilyId = await getActiveFamilyId();
  if (!activeFamilyId) {
    return {
      success: false,
      message: 'Create a family first!',
      event: null,
    };
  }
  const me = await getActiveMember();
  if (!me) {
    return {
      success: false,
      message: `Can't figure out who you are for some reason.`,
      event: null,
    };
  }
  try {
    const updatedEvent = await prisma.event.update({
      where: {
        id,
        family: {
          id: activeFamilyId,
          managers: {
            some: {
              id: me.id,
            },
          },
        },
      },
      data: {
        ...validatedData,
        info: validatedData.info as JSONContent,
      },
    });
    if (updatedEvent) {
      revalidatePath(`/dashboard/event/${updatedEvent.id}`);
      return {
        success: true,
        message: '',
        event: updatedEvent,
      };
    } else {
      return {
        success: false,
        message: `Couldn't update event.`,
        event: null,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      event: null,
    };
  }
}
