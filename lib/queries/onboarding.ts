import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { cache } from 'react';

export const getInvitedMember = cache(async (token: string) => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      familyMember: null,
    };
  }

  try {
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        inviteToken: token,
      },
      include: {
        family: {
          include: {
            managers: {
              include: {
                user: true
              }
            },
            _count: {
              select: {
                members: true,
                listsVisible: true,
                events: true
              }
            }
          }
        },
      },
    });
    if (familyMember) {
      return {
        success: true,
        familyMember,
        message: '',
      };
    } else {
      return {
        success: false,
        message: `Couldn't find matching member request for this token.`,
        familyMember: null,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      familyMember: null,
    };
  }
});
