import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { cache } from 'react';

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
