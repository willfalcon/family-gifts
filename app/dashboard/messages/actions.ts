'use server';

import { getUser as getUserQuery } from '@/lib/queries/user';
import { User } from '@prisma/client';
import { cache } from 'react';

const getUser = cache(async (id: User['id']) => {
  return await getUserQuery(id);
});

export async function getSender(userId: string): Promise<User | string> {
  const user = await getUser(userId);
  return user;
}
