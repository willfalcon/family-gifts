'use server';

import { getUser } from '@/lib/queries/user';
import { User } from '@prisma/client';

export async function getSender(userId: string): Promise<User | string> {
  const user = await getUser(userId);
  return user;
}
