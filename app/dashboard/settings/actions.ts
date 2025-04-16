'use server';

import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { User } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { ProfileSchema, ProfileSchemaType } from './profileSchema';

export async function updateProfile(data: ProfileSchemaType) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const validatedData = ProfileSchema.parse(data);

  const user = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: validatedData,
  });

  revalidatePath('/dashboard/profile');
  return user;
}
export async function updatePrivacySettings(data: Pick<User, 'profileVisibility' | 'wishListVisibility'>) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const user = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      profileVisibility: data.profileVisibility,
      wishListVisibility: data.wishListVisibility,
    },
  });

  revalidatePath('/dashboard/profile');
  return user;
}
