'use server';

import { auth } from '@/auth';
import { ProfileSchema, ProfileSchemaType } from './profileSchema';
import { prisma } from '@/prisma';
import { revalidatePath } from 'next/cache';
import { getActiveFamilyId } from '@/lib/rscUtils';
import { getActiveMember } from '@/lib/queries/family-members';

export async function updateProfile(data: ProfileSchemaType) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      profile: null,
    };
  }

  const validatedData = ProfileSchema.parse(data);

  try {
    const activeFamilyId = await getActiveFamilyId();
    if (!activeFamilyId) {
      return {
        success: false,
        message: 'Must be in a family to update profile!',
        profile: null,
      };
    }

    const me = await getActiveMember();
    if (!me) {
      return {
        success: false,
        message: `Can't figure out who you are for some reason.`,
        profile: null,
      };
    }

    const user = await prisma.familyMember.update({
      where: {
        id: me.id,
      },
      data: {
        ...validatedData,
      },
    });
    if (!user) {
      return {
        success: false,
        message: `Couldn't update profile`,
        profile: false,
      };
    }
    revalidatePath('/dashboard/profile');
    return {
      success: true,
      message: `Profile updated`,
      profile: user,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: `Something went wrong`,
      profile: false,
    };
  }
}
