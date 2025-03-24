import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { isAfter } from 'date-fns';
import { cache } from 'react';

export const getInvitedMember = cache(async (token: string) => {
  // const session = await auth();
  // if (!session?.user) {
  //   throw new Error('You must be logged in to do this!');
  // }

  const invite = await prisma.invite.findFirst({
    where: {
      token,
    },
    include: {
      family: {
        include: {
          managers: true,
          _count: {
            select: {
              members: true,
              visibleLists: true,
              events: true,
            },
          },
        },
      },
      event: {
        include: {
          creator: true,
          _count: {
            select: {
              visibleLists: true,
              attendees: true,
            },
          },
        },
      },
      inviter: true,
    },
  });
  if (invite) {
    return invite;
  } else {
    throw new Error(`Couldn't find your invitation`);
  }
});
