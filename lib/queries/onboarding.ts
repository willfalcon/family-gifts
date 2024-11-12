import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { cache } from 'react';

export const getInvitedMember = cache(async (token: string) => {
  const session = await auth();
  if (!session?.user) {
    return {
      error: 'Not logged in',
      message: 'You must be logged in to do this.',
      families: [],
    };
  }

  try {
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        inviteToken: token,
      },
      include: {
        family: true,
      },
    });
    if (familyMember) {
      return {
        success: true,
        familyMember,
      };
    } else {
      return {
        success: false,
        message: `Couldn't find matching member request for this token.`,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
    };
  }
});
