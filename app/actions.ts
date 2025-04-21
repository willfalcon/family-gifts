'use server';

import { signIn, signOut } from '@/auth';
import { type User } from '@prisma/client';

import { api } from '@/convex/_generated/api';
import { getList as getListQuery } from '@/lib/queries/items';
import { getUser as getUserQuery } from '@/lib/queries/user';
import { ConvexHttpClient } from 'convex/browser';
export async function serverSignIn({ provider }: { provider?: string }) {
  await signIn(provider);
}

export async function serverSignOut() {
  await signOut();
}

export async function getList(id: string) {
  return await getListQuery(id);
}

export async function getUser(id: User['id']) {
  return await getUserQuery(id);
}

export async function createIndividualChannel(starterId: string, recipientId: string) {
  const starter = await getUser(starterId);
  const recipient = await getUser(recipientId);

  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const channel = await client.mutation(api.channels.createChannel, {
    type: 'individual',
    name: `${starter.name} and ${recipient.name}`,
    users: [starterId, recipientId],
    messages: [],
  });

  return channel;
}
