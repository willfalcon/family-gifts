'use server';

import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { List } from '@prisma/client';
import { JSONContent } from '@tiptap/react';
import { revalidatePath } from 'next/cache';

import { getEvents as getEventsQuery } from '@/lib/queries/events';
import { getFamilies as getFamiliesQuery } from '@/lib/queries/families';
import { ListSchema, ListSchemaType } from './listSchema';

export async function getFamilies() {
  return await getFamiliesQuery();
}

export async function getEvents() {
  return await getEventsQuery();
}

export async function updateList(id: List['id'], data: ListSchemaType) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  try {
    const validatedData = ListSchema.parse(data);
    const previousVisibleTo = await prisma.list.findUnique({
      where: { id },
      select: { visibleToFamilies: true, visibleToEvents: true, visibleToUsers: true },
    });

    const updatedList = await prisma.list.update({
      where: {
        id,
      },
      data: {
        ...validatedData,
        description: validatedData.description as JSONContent,
        visibleToFamilies: {
          connect: validatedData.visibleToFamilies.map((id) => ({ id })),
          disconnect: previousVisibleTo?.visibleToFamilies
            .filter(({ id }) => !validatedData.visibleToFamilies.includes(id))
            .map(({ id }) => ({ id })),
        },
        visibleToEvents: {
          connect: validatedData.visibleToEvents.map((id) => ({ id })),
          disconnect: previousVisibleTo?.visibleToEvents.filter(({ id }) => !validatedData.visibleToEvents.includes(id)).map(({ id }) => ({ id })),
        },
        visibleToUsers: {
          connect: validatedData.visibleToUsers.map((id) => ({ id })),
          disconnect: previousVisibleTo?.visibleToUsers.filter(({ id }) => !validatedData.visibleToUsers.includes(id)).map(({ id }) => ({ id })),
        },
      },
    });

    revalidatePath('/wish-lists/[id]', 'page');

    return updatedList;
  } catch (err) {
    console.error(err);
    throw new Error('Something went wrong.');
  }
}

export async function getRelatedUsers() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const userInfo = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      families: {
        include: {
          members: true,
        },
      },
      events: {
        include: {
          attendees: true,
        },
      },
    },
  });

  const relatedUsers = userInfo?.families.flatMap((family) => family.members).concat(userInfo?.events.flatMap((event) => event.attendees));

  return relatedUsers;
}
