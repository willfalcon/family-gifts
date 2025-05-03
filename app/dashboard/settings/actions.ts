'use server';

import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { User } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { compare, genSalt, hash } from 'bcryptjs';
import { passwordErrors, passwordSchema, PasswordSchemaType, ProfileSchema, ProfileSchemaType } from './profileSchema';

export async function updateProfile(data: ProfileSchemaType) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const { imageUrl, ...rest } = ProfileSchema.parse(data);

  const user = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      ...rest,
      image: imageUrl,
    },
  });

  revalidatePath('/dashboard/profile');
  return user;
}
export async function updatePrivacySettings(data: Pick<User, 'profileVisibility' | 'defaultListVisibility'>) {
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
      defaultListVisibility: data.defaultListVisibility,
    },
  });

  revalidatePath('/dashboard/profile');
  return user;
}

export async function changePassword(data: PasswordSchemaType) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const validatedData = passwordSchema.parse(data);

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.password) {
    throw new Error('User does not have a password');
  }

  if (!validatedData.password) {
    throw new Error(passwordErrors.PASSWORD_REQUIRED);
  }

  const correctPassword = await compare(validatedData.password, user.password);

  if (!correctPassword) {
    throw new Error(passwordErrors.PASSWORD_INCORRECT);
  }

  if (validatedData.newPassword !== validatedData.confirmPassword) {
    throw new Error(passwordErrors.PASSWORD_MISMATCH);
  }

  const salt = await genSalt(10);
  const hashedPassword = await hash(validatedData.newPassword, salt);

  const updatedUser = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      password: hashedPassword,
      salt,
    },
  });

  revalidatePath('/dashboard/profile');
  return updatedUser;
}

export async function setPassword(data: PasswordSchemaType) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const validatedData = passwordSchema.parse(data);

  const salt = await genSalt(10);
  const hashedPassword = await hash(validatedData.newPassword, salt);

  const user = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      password: hashedPassword,
      salt,
    },
  });

  revalidatePath('/dashboard/profile');
  return user;
}
