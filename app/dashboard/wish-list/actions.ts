'use server';

import { auth } from '@/auth';
import { ItemSchema, ItemSchemaType } from './itemSchema';
import { prisma } from '@/prisma';
import { revalidatePath } from 'next/cache';
import { Item } from '@prisma/client';
import { getASIN } from '@/lib/utils';
import { getFamilyMember } from '@/lib/queries/family-members';
import { getDefaultListId } from '@/lib/queries/lists';
import { JSONContent } from '@tiptap/react';

export type CreateItemReturn = {
  item?: Item;
  success: boolean;
  message?: string;
  error?: string;
};

export async function createItem(data: ItemSchemaType & { listId: string | undefined }) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      item: null,
    };
  }

  const validatedData = ItemSchema.parse(data);

  try {
    const listId = data.listId ? data.listId : await getDefaultListId(session.user.id!).then((res) => res.listId);
    const me = await getFamilyMember();
    if (!me.success || !me.member) {
      return {
        success: false,
        message: `Make sure you're logged in and in a family`,
        item: null,
      };
    }
    if (listId) {
      const item = await prisma.item.create({
        data: {
          ...validatedData,
          notes: validatedData.notes as JSONContent,
          list: {
            connect: {
              id: listId,
            },
          },
          member: {
            connect: {
              id: me.member.id,
            },
          },
        },
      });

      revalidatePath('/wish-list/[id]', 'page');
      revalidatePath('/wish-list');

      return {
        success: true,
        item,
        message: '',
      };
    } else {
      return {
        success: false,
        message: `Couldn't find family member.`,
        item: null,
      };
    }
  } catch (err) {
    console.error('Error creating item: ', err);
    return {
      success: false,
      message: 'Something went wrong!',
      item: null,
    };
  }
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

export async function editItem(id: Item['id'], data: ItemSchemaType) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      item: null,
    };
  }

  const validatedData = ItemSchema.parse(data);

  try {
    const { member, message } = await getFamilyMember();

    if (member) {
      const originalItem = await prisma.item.findUnique({
        where: { id },
      });
      if (originalItem?.memberId !== member.id) {
        return {
          success: false,
          item: null,
          message: 'You do not have permission to edit this item.',
        };
      }
      const item = await prisma.item.update({
        where: {
          id,
          member: {
            is: {
              id: member.id,
            },
          },
        },
        data: {
          ...validatedData,
          notes: validatedData.notes as JSONContent,
        },
      });

      if (item?.link && (!originalItem?.image || originalItem?.image !== item?.image)) {
        await maybeGetImage(item);
      }
      revalidatePath('/wish-list');

      return {
        success: true,
        item,
        message: '',
      };
    } else {
      return {
        success: false,
        item: null,
        message,
      };
    }
  } catch (err) {
    console.error('Error updating item: ', err);
    return {
      success: false,
      message: 'Something went wrong!',
      item: null,
    };
  }
}

export async function deleteItem(id: Item['id']) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
    };
  }

  try {
    const { member, message } = await getFamilyMember();

    if (member) {
      const originalItem = await prisma.item.findUnique({
        where: { id },
      });

      if (originalItem?.memberId !== member.id) {
        return {
          success: false,
          message: 'You do not have permission to delete this item.',
        };
      }

      const item = await prisma.item.delete({
        where: {
          member: {
            is: {
              id: member.id,
            },
          },
          id,
        },
      });
      if (item) {
        revalidatePath('/wish-list');
        return {
          success: true,
          message: 'Item deleted.',
        };
      } else {
        return {
          success: false,
          message: `Couldn't find item to delete.`,
        };
      }
    } else {
      return {
        success: false,
        message,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
    };
  }
}

export async function getItemBoughtBy(itemId: Item['id']) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      item: null,
    };
  }

  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
    include: {
      boughtBy: true, // FamilyMember[]
      member: true, // FamilyMember
    },
  });

  if (item) {
    return {
      success: true,
      message: '',
      item,
    };
  }
  return {
    success: false,
    message: `Couldn't find the item.`,
    item: null,
  };
}

export async function toggleBoughtBy(itemId: Item['id'], bought: boolean | undefined) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      item: null,
    };
  }

  try {
    const { member: currentMember, success, message } = await getFamilyMember();

    if (!success || !currentMember) {
      return {
        success: false,
        message: `Couldn't find you... are you sure you're in this family?`,
        item: null,
      };
    }

    const item = await prisma.item.update({
      where: {
        id: itemId,
      },
      data: {
        boughtBy: {
          ...(bought
            ? {
                connect: {
                  id: currentMember.id,
                },
              }
            : {
                disconnect: {
                  id: currentMember.id,
                },
              }),
        },
      },
    });

    if (item) {
      return {
        success: true,
        message: '',
        item,
      };
    }
    return {
      success: false,
      message: `Either couldn't find the item to update or couldn't mark it as bought for you.`,
      item,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      item: null,
    };
  }
}
