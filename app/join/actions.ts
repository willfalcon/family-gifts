'use server';

import { auth } from '@/auth';
import { api } from '@/convex/_generated/api';
import { prisma } from '@/prisma';
import { ConvexHttpClient } from 'convex/browser';

export async function joinFamily(token: string) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      updatedMember: null,
    };
  }

  const familyMember = await prisma.familyMember.findFirst({
    where: {
      inviteToken: token,
    },
  });

  if (familyMember) {
    if (familyMember.inviteTokenExpiry && familyMember.inviteTokenExpiry < new Date()) {
      return {
        success: false,
        message: 'This invite has expired. Ask the family manager to send you a new one.',
        updatedMember: null,
      }
    }
    try {
      const updatedMember = await prisma.familyMember.update({
        where: {
          id: familyMember.id,
        },
        data: {
          user: {
            connect: {
              id: session.user.id,
            },
          },
          joined: true,
          inviteToken: null,
          inviteTokenExpiry: null,
        },
      });
      if (updatedMember) {
        // Add the user to the family channe
        const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

        await client.mutation(api.channels.addChannelUser, {
          family: updatedMember.familyId,
          user: updatedMember.userId!,
        });
        return {
          success: true,
          updatedMember,
          message: ''
        };
      }

      return {
        success: false,
        updatedMember: null,
        message: `Couldn't find the family member. How did you get here with logging in our making an account?`
      };
      
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: 'Something went wrong. 🤷‍♂️',
        updatedMember: null,
      };
    }
  }
  return {
    success: false,
    message: 'Invalid token.',
    updatedMember: null,
  };
}
