'use server';

import { signIn, signOut } from '@/auth';
import { type User } from '@prisma/client';

import { api } from '@/convex/_generated/api';
import { getList as getListQuery } from '@/lib/queries/items';
import { getUser as getUserQuery } from '@/lib/queries/user';
import { ConvexHttpClient } from 'convex/browser';
import { cache } from 'react';

export async function serverSignIn({ provider }: { provider?: string }) {
  await signIn(provider);
}

export async function serverSignOut() {
  await signOut();
}

export async function getList(id: string) {
  return await getListQuery(id);
}

export const getUser = cache(async (id: User['id']) => {
  return await getUserQuery(id);
});

export async function createIndividualChannel(starterId: string, recipientId: string, anonymous: boolean = false) {
  const starter = await getUser(starterId);
  const recipient = await getUser(recipientId);

  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const channel = await client.mutation(api.channels.createChannel, {
    type: anonymous ? 'anonymous' : 'individual',
    name: anonymous ? `Anonymous conversation with ${recipient.name}` : `${starter.name} and ${recipient.name}`,
    users: [starterId, recipientId],
    messages: [],
    ...(anonymous && { anonymousSender: starterId }),
  });

  return channel;
}
