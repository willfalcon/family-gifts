'use client';

import { Button } from '@/components/ui/button';

import { joinEvent, joinFamily } from './actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { GetInvite } from '@/lib/queries/onboarding';
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
            router.push(`/dashboard/family/${res.familyId}`);
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
