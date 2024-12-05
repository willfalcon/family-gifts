'use server';

import { auth } from '@/auth';
import { getFamilyMember } from '@/lib/queries/family-members';
import { prisma } from '@/prisma';
import { Item } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function markItemAsBought(id: Item['id']) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      item: null,
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
      revalidatePath('/family');

      return {
        success: true,
        item,
        message: 'Item marked as bought',
      };
    } else {
      return {
        success: false,
        message,
        item: null,
      };
    }
  } catch (err) {
    console.error('Error updating item: ', err);
    return {
      success: false,
      error: 'Something went wrong!',
      item: null,
    };
  }
}

export async function unmarkItemAsBought(id: Item['id']) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      item: null,
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
            disconnect: {
              id: member.id,
            },
          },
        },
      });
      revalidatePath('/family');

      return {
        success: true,
        item,
        message: 'Item unmarked',
      };
    } else {
      return {
        success: false,
        message,
        item: null,
      };
    }
  } catch (err) {
    console.error('Error updating item: ', err);
    return {
      success: false,
      error: 'Something went wrong!',
      item: null,
    };
  }
}
