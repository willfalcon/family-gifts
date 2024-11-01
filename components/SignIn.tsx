import { ComponentPropsWithRef } from 'react';
import { Button } from './ui/button';
import { signIn } from '@/auth';

export default function SignIn({ provider, ...props }: { provider?: string } & ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        'use server';
        await signIn(provider);
      }}
    >
      <Button {...props}>Sign In</Button>
    </form>
  );
}
