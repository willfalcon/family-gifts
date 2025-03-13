import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { cache } from 'react';
import { getActiveFamilyId } from '../rscUtils';

export const getFamily = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      family: null,
    };
  }

  try {
    const activeFamilyId = await getActiveFamilyId();
    if (!activeFamilyId) {
      return {
        success: false,
        message: `Make sure you're logged in and are in a family.`,
        family: null,
      };
    }
    const family = await prisma.family.findUnique({
      where: {
        id: activeFamilyId,
      },
      include: {
        managers: true,
      },
    });
    if (family) {
      return {
        success: true,
        message: '',
        family,
      };
    } else {
      return {
        success: false,
        message: `Couldn't find family.`,
        family: null,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      family: null,
    };
  }
});

export const getFamilies = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      families: [],
    };
  }
  const families = await prisma.family.findMany({
    where: {
      members: {
        some: {
          user: {
            id: session.user.id,
          },
        },
      },
    },
    include: {
      managers: true,
    },
  });
  return {
    success: true,
    families,
    message: '',
  };
});
