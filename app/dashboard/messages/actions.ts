'use server';

import { getUser } from '@/lib/queries/user';
import { User } from '@prisma/client';

export async function getSender(userId: string): Promise<User | string> {
  try {
    const { success, user, message } = await getUser(userId);
    if (!success || !user) {
      throw new Error(message);
    }
    return user;
  } catch (err) {
    console.error(err);
    throw new Error(`Something went wrong.`);
  }
}
