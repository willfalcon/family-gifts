import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { User } from '@prisma/client';
import { cache } from 'react';

export const getUser = cache(async (id: User['id']) => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      user: null,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      return {
        success: true,
        message: '',
        user,
      };
    }
    return {
      success: false,
      message: `Couldn't find user.`,
      user: null,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: `Something went wrong.`,
      user: null,
    };
  }
});
