'use client';

import Chat from '@/app/dashboard/messages/Chat';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';

type Props = {
  trigger: React.ReactNode;
  user: string;
  familyId?: string;
  eventId?: string;
};

export default function MessageDialog({ trigger, user, familyId, eventId }: Props) {
  const channel = useQuery(api.channels.getChannel, {
    familyId,
    eventId,
  });

  console.log(channel);

  return (
    channel && (
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>
          <Chat channel={channel} user={user} />
        </DialogContent>
      </Dialog>
    )
  );
}
