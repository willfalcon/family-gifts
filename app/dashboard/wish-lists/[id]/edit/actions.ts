'use server';

import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { Item, List } from '@prisma/client';
import { JSONContent } from '@tiptap/react';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';

import { getListForEdit as getListForEditQuery } from '@/lib/queries/items';
import { del } from '@vercel/blob';
import { ItemSchema, ItemSchemaType } from '../itemSchema';

export const getItemToEdit = cache(async (id: string) => {
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
});

export async function getListForEdit(id: List['id']) {
  return await getListForEditQuery(id);
}

export async function updateItem(id: Item['id'], data: ItemSchemaType) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const { imageUrl, ...rest } = ItemSchema.parse(data);

  const currentItem = await getItemToEdit(id);

  const oldImage = currentItem?.image;
  if (oldImage && imageUrl !== oldImage) {
    await del(oldImage);
  }

  const item = await prisma.item.update({
    where: {
      id,
      list: {
        userId: session.user.id,
      },
    },
    data: {
      ...rest,
      notes: rest.notes as JSONContent,
      image: imageUrl,
    },
  });

  revalidatePath('/wish-lists/[id]', 'page');
  revalidatePath('/wish-lists');

  return item;
}

export async function deleteItem(id: Item['id']) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const item = await getItemToEdit(id);

  if (!item) {
    throw new Error('Item not found');
  }

  const list = await getListForEdit(item.listId);
  if (list?.userId !== session.user.id) {
    throw new Error('You are not allowed to delete this item');
  }

  await prisma.item.delete({
    where: {
      id,
    },
  });

  if (item.image) {
    await del(item.image);
  }

  const newList = {
    ...list,
    items: list?.items.filter((item) => item.id !== id),
  };

  revalidatePath('/wish-lists/[id]', 'page');
  return newList;
}
