'use server';

import { revalidatePath } from 'next/cache';
import { JSONContent } from '@tiptap/react';
import { auth } from '@/auth';
import { prisma } from '@/prisma';

import { ListSchema, type ListSchemaType } from '../listSchema';

export async function createList(data: ListSchemaType) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const validatedData = ListSchema.parse(data);
  const newList = await prisma.list.create({
    data: {
      ...validatedData,
      description: validatedData.description as JSONContent,
      visibleToFamilies: {
        connect: validatedData.visibleToFamilies.map((id) => ({ id })),
      },
      visibleToEvents: {
        connect: validatedData.visibleToEvents.map((id) => ({ id })),
      },
      visibleToUsers: {
        connect: validatedData.visibleToUsers.map((id) => ({ id })),
      },
      user: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });

  revalidatePath('/dashboard/wish-lists');

  return newList;
}
