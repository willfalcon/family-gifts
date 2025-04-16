import { ComponentPropsWithRef } from 'react';

import { serverSignOut } from '@/app/actions';

import { Button } from './ui/button';

export default function SignOut(props: ComponentPropsWithRef<typeof Button>) {
  return (
    <form action={serverSignOut} className="w-full">
      <Button variant="ghost" className="w-full p-0" {...props}>
        Sign Out
      </Button>
    </form>
  );
}
