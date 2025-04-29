'use server';

import { signIn } from '@/auth';

export async function handleSignIn(formData: FormData) {
  await signIn('credentials', formData);
}

export async function handleSignInWithProvider(provider: string, callbackUrl?: string) {
  await signIn(provider, { redirectTo: callbackUrl ?? '/dashboard' });
}

export async function handleSignInWithFacebook() {
  await signIn('facebook');
}

export async function handleSignInWithGoogle() {
  await signIn('google');
}
