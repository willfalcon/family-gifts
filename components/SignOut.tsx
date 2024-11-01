import { ComponentPropsWithRef } from 'react';
import { Button } from './ui/button';
import { serverSignOut } from '@/app/actions';

export default function SignOut(props: ComponentPropsWithRef<typeof Button>) {
  return (
    <form action={serverSignOut} className="w-full">
      <Button variant="ghost" className="w-full p-0" {...props}>
        Sign Out
      </Button>
    </form>
  );
}
