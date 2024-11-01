'use server';

import { auth } from '@/auth';
import { EventSchema, EventSchemaType } from './eventSchema';
import { getActiveFamilyId } from '@/lib/rscUtils';
import { prisma } from '@/prisma';
import { revalidatePath } from 'next/cache';
import { JSONContent } from '@tiptap/react';

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

  const activeFamilyId = getActiveFamilyId();

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
