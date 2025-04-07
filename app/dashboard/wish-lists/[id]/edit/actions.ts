'use server';

import { auth } from '@/auth';
import { ItemSchema, ItemSchemaType } from '../itemSchema';
import { prisma } from '@/prisma';
import { revalidatePath } from 'next/cache';
import { Item } from '@prisma/client';
import { getASIN } from '@/lib/utils';
import { getFamilyMember } from '@/lib/queries/family-members';
import { getDefaultListId } from '@/lib/queries/lists';
import { JSONContent } from '@tiptap/react';
import { getList } from '@/lib/queries/items';

export const getItemToEdit = async (id: string) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const item = await prisma.item.findUnique({
    where: {
      id,
      list: {
        userId: session.user.id,
      },
    },
  });
  return item;
};

export async function updateItem(id: Item['id'], data: ItemSchemaType) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const validatedData = ItemSchema.parse(data);

  const item = await prisma.item.update({
    where: {
      id,
      list: {
        userId: session.user.id,
      },
    },
    data: {
      ...validatedData,
      notes: validatedData.notes as JSONContent,
    },
  });

  revalidatePath('/wish-lists/[id]', 'page');
  revalidatePath('/wish-lists');

  return item;
}
