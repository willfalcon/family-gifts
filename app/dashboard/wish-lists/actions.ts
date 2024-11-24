'use server';
import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { ListSchema, ListSchemaType } from './listSchema';
import { revalidatePath } from 'next/cache';
import { List } from '@prisma/client';

export async function createList(data: ListSchemaType) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      list: undefined,
    };
  }

  try {
    const validatedData = ListSchema.parse(data);
    const newList = await prisma.list.create({
      data: {
        ...validatedData,
        visibleTo: {
          connect: validatedData.visibleTo.map((id) => ({ id })),
        },
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    if (!newList) {
      return {
        success: false,
        message: `Couldn't create list`,
        list: undefined,
      };
    }

    revalidatePath('/wish-lists');

    return {
      success: true,
      message: 'List created!',
      list: newList,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: `Something went wrong.`,
      list: undefined,
    };
  }
}

export async function updateList(id: List['id'], data: ListSchemaType) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      list: undefined,
    };
  }

  try {
    const validatedData = ListSchema.parse(data);
    const previousVisibleTo = await prisma.list.findUnique({ where: { id }, select: { visibleTo: true } });

    const updatedList = await prisma.list.update({
      where: {
        id,
      },
      data: {
        ...validatedData,
        visibleTo: {
          connect: validatedData.visibleTo.map((id) => ({ id })),
          disconnect: previousVisibleTo?.visibleTo.filter(({ id }) => !validatedData.visibleTo.includes(id)).map(({ id }) => ({ id })),
        },
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    if (!updatedList) {
      return {
        success: false,
        message: `Couldn't update list`,
        list: undefined,
      };
    }

    revalidatePath('/wish-lists');

    return {
      success: true,
      message: 'List updated!',
      list: updatedList,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: `Something went wrong.`,
      list: undefined,
    };
  }
}
