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
    };
  }

  const familyMember = await prisma.familyMember.findFirst({
    where: {
      inviteToken: token,
    },
  });

  if (familyMember) {
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
        },
      });
      if (updatedMember) {
        const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

        await client.mutation(api.channels.addChannelUser, {
          family: updatedMember.familyId,
          user: updatedMember.userId!,
        });
        return {
          success: true,
          updatedMember,
        };
      }
      // Update the family channel in Convex
    } catch (err) {
      console.error(err);
      return {
        success: false,
      };
    }
  } else {
    return {
      success: false,
    };
  }
}
