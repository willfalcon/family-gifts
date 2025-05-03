'use server';

import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { Item } from '@prisma/client';
import { JSONContent } from '@tiptap/react';
import { revalidatePath } from 'next/cache';

import { getList } from '@/lib/queries/items';
import { getASIN } from '@/lib/utils';
import { ItemSchema, ItemSchemaType } from './itemSchema';

export async function createItem(data: ItemSchemaType & { listId: string }) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const { imageUrl, ...rest } = ItemSchema.parse(data);

  const list = await getList(data.listId);

  if (!list) {
    throw new Error('List not found');
  }

  if (list.user.id !== session.user.id) {
    throw new Error('You do not have permission to do this.');
  }

  const item = await prisma.item.create({
    data: {
      ...rest,
      notes: rest.notes as JSONContent,
      image: imageUrl,
      list: {
        connect: {
          id: data.listId,
        },
      },
    },
  });

  revalidatePath('/wish-lists/[id]', 'page');
  revalidatePath('/wish-lists');

  return item;
}

export async function maybeGetImage(item: Item) {
  const asin = await getASIN(item.link!); //link check is done before calling function in NewItem's onSubmit handler
  if (asin) {
    const query = `
          query amazonProduct {
            amazonProduct(input: {asin: "${asin}"}) {
              title
              mainImageUrl
              price {
                display
              }
            }
          }
        `;
    try {
      const productData = await fetch(`https://graphql.canopyapi.co/`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'API-KEY': process.env.CANOPY_API_KEY || '',
        },
        body: JSON.stringify({ query }),
      }).then((res) => res.json());

      if (productData.data.amazonProduct) {
        const itemWithImage = await prisma.item.update({
          where: {
            id: item.id,
          },
          data: {
            image: productData.data.amazonProduct.mainImageUrl,
          },
        });

        revalidatePath('/wish-list');
        return itemWithImage;
      }
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  }
}

const isItemVisibleToCurrentUser = async (itemId: string) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
    include: {
      list: {
        include: {
          visibleToEvents: {
            include: {
              attendees: true,
            },
          },
          visibleToFamilies: {
            include: {
              members: true,
            },
          },
          visibleToUsers: true,
        },
      },
    },
  });

  if (!item) {
    throw new Error(`Item doesn't exist`);
  }

  if (item.list?.visibleToUsers.some((user) => user.id === session?.user?.id)) {
    return true;
  }
  if (item.list?.visibleToFamilies.some((family) => family.members.some((member) => member.id === session?.user?.id))) {
    return true;
  }
  if (item.list?.visibleToEvents.some((event) => event.attendees.some((attendee) => attendee.id === session?.user?.id))) {
    return true;
  }

  return false;
};

export async function getPurchasedBy(itemId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
    include: {
      purchasedBy: true,
    },
  });
  if (!isItemVisibleToCurrentUser(itemId)) {
    throw new Error('You do not have permission to do this.');
  }

  return item?.purchasedBy;
}

export async function markAsPurchased(action: 'mark' | 'unmark', itemId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
  });
  if (!item) {
    throw new Error('Item not found');
  }

  if (!isItemVisibleToCurrentUser(itemId)) {
    throw new Error('You do not have permission to do this.');
  }

  const updatedItem = await prisma.item.update({
    where: {
      id: itemId,
    },
    data: {
      purchasedBy:
        action === 'mark'
          ? {
              connect: { id: session.user.id },
            }
          : {
              disconnect: { id: session.user.id },
            },
    },
    include: {
      purchasedBy: true,
    },
  });

  return updatedItem.purchasedBy;
}
