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
          const res = await joinFamily(token);

          toast.success(`Welcome, ${res.userName}`);
          router.push(`/dashboard/family/${res.familyId}`);
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
