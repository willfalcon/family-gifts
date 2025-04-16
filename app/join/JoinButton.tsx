'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { type GetInvite } from '@/lib/queries/onboarding';
import { joinEvent, joinFamily } from './actions';

import { Button } from '@/components/ui/button';

type Props = {
  name: string;
  token: string;
  inviteType: 'Family' | 'Event';
  invite: GetInvite;
};

export default function JoinButton({ name, token, inviteType, invite }: Props) {
  const router = useRouter();

  //TODO: add option to join as a maybe right away
  return (
    <Button
      onClick={async () => {
        try {
          if (inviteType === 'Family') {
            const res = await joinFamily(invite);
            toast.success(`Welcome, ${res.userName}`);
            router.push(`/dashboard/families/${res.familyId}`);
          } else {
            const res = await joinEvent(invite);
            toast.success(`Welcome, ${res.userName}`);
            router.push(`/dashboard/events/${res.eventId}`);
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
