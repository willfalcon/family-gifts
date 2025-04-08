'use server';

import { auth } from '@/auth';
import { ProfileSchema, ProfileSchemaType } from './profileSchema';
import { prisma } from '@/prisma';
import { revalidatePath } from 'next/cache';

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
