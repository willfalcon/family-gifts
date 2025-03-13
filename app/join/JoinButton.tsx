'use client';

import { Button } from '@/components/ui/button';

import { joinFamily } from './actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Props = {
  name: string;
  token: string;
};

export default function JoinButton({ name, token }: Props) {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        try {
          const { success, updatedMember, message } = await joinFamily(token);
          if (success) {
            toast.success(`Welcome, ${updatedMember?.name}`);
            router.push('/dashboard/manage-family');
          } else {
            toast.warning(message);
          }
        } catch (err) {
          console.log(err);
          toast.error('Error.');
        }
      }}
    >
      Join {name}
    </Button>
  );
}
