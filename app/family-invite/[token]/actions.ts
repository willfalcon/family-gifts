'use server';

import { auth } from '@/auth';
import { prisma } from '@/prisma';

export async function getFamilyByInviteLinkToken(token: string) {
  const family = await prisma.family.findFirst({
    where: { inviteLinkToken: token },
    include: {
      _count: {
        select: {
          members: true,
          visibleLists: true,
          events: true,
        },
      },
    },
  });
  if (!family) {
    throw new Error('Family not found');
  }
  return family;
}

export async function joinFamily(family: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }
  if (!session?.user?.id) {
    throw new Error('Session error. Try logging out and in again.');
  }
  const updatedFamily = prisma.family.update({
    where: {
      id: family,
    },
    data: {
      invites: {
        create: {
          needsApproval: true,
          user: {
            connect: {
              id: session.user.id,
            },
          },
        },
      },
    },
    include: {
      members: true,
    },
  });
  return updatedFamily;
}
