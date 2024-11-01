'use server';

import { signIn, signOut } from '@/auth';

export async function serverSignIn({ provider }: { provider?: string }) {
  await signIn(provider);
}

export async function serverSignOut() {
  await signOut();
}
