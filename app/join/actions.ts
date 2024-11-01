'use server';

import { auth } from "@/auth";
import { prisma } from "@/prisma";

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
    }
  });

  if (familyMember) {

    try {
      const updatedMember = await prisma.familyMember.update({
        where: {
          id: familyMember.id
        },
        data: {
          user: {
            connect: {
              id: session.user.id
            }
          },
          joined: true
        }
      });
      return {
        success: true,
        updatedMember
      }
    } catch(err) {
      console.error(err);
      return {
        success: false
      }
    }

  } else {
    return {
      success: false
    }
  }
    
}