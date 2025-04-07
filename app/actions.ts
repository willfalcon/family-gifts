'use server';

import { signIn, signOut } from '@/auth';
import { getList as getListQuery } from '@/lib/queries/items';

export async function serverSignIn({ provider }: { provider?: string }) {
  await signIn(provider);
}

export async function serverSignOut() {
  await signOut();
}

export async function getList(id: string) {
  return await getListQuery(id);
}
