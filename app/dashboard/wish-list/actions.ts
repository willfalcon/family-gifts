'use server';

import { auth } from '@/auth';
import { ItemSchema, ItemSchemaType } from './wishListSchema';
import { prisma } from '@/prisma';
import { revalidatePath } from 'next/cache';
import { Item } from '@prisma/client';
import { getASIN } from '@/lib/utils';
import { getFamilyMember } from '@/lib/queries/family-members';

export type CreateItemReturn = {
  item?: Item;
  success: boolean;
  message?: string;
  error?: string;
};

export async function createItem(data: ItemSchemaType) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
    };
  }

  const validatedData = ItemSchema.parse(data);

  try {
    const { member } = await getFamilyMember();

    if (member) {
      const item = await prisma.item.create({
        data: {
          ...validatedData,
          member: {
            connect: {
              id: member?.id,
            },
          },
        },
      });

      revalidatePath('/wish-list');

      return {
        success: true,
        item,
      };
    } else {
      return {
        success: false,
        message: `Couldn't find family member.`,
      };
    }
  } catch (err) {
    console.error('Error creating item: ', err);
    return {
      success: false,
      error: 'Something went wrong!',
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
    };
  }

  const validatedData = ItemSchema.parse(data);

  try {
    const { member, message } = await getFamilyMember();

    if (member) {
      const originalItem = await prisma.item.findUnique({
        where: { id },
      });
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
        },
      });

      if (item?.link && (!originalItem?.image || originalItem?.image !== item?.image)) {
        await maybeGetImage(item);
      }
      revalidatePath('/wish-list');

      return {
        success: true,
        item,
      };
    } else {
      return {
        success: false,
        message,
      };
    }
  } catch (err) {
    console.error('Error updating item: ', err);
    return {
      success: false,
      error: 'Something went wrong!',
    };
  }
}

export async function markItemAsBought(id: Item['id']) {
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
      const item = await prisma.item.update({
        where: {
          id,
          member: {
            familyId: member.familyId,
          },
        },
        data: {
          boughtBy: {
            connect: {
              id: member.id,
            },
          },
        },
      });
      revalidatePath('/wish-list');

      return {
        success: true,
        item,
      };
    } else {
      return {
        success: false,
        message,
      };
    }
  } catch (err) {
    console.error('Error updating item: ', err);
    return {
      success: false,
      error: 'Something went wrong!',
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
