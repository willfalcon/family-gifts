'use client';

import { createIndividualChannel } from '@/app/actions';
import Chat from '@/app/dashboard/messages/Chat';
import useMessages from '@/app/dashboard/messages/useMessages';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { useQuery } from 'convex/react';
import { Loader2, MessagesSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

type Props = {
  user: string;
  familyId?: string;
  eventId?: string;
  dmId?: string;
  className?: string;
};

export default function AnonymousMessageDialog({ user, dmId, className }: Props) {
  const channel = useQuery(api.channels.getChannel, {
    dmId,
    userId: user,
    anonymous: true,
  });
  console.log(channel);

  const { hasUnreadMessages } = useMessages({ channelId: channel?._id, userId: user });

  const { mutate: createChannel, isPending } = useMutation({
    mutationFn: async () => {
      if (user && dmId) {
        return await createIndividualChannel(user, dmId, true);
      }
    },
  });

  return (
    (channel || dmId) && (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className={cn('relative', className)}>
            <MessagesSquare className="w-5 h-5" />
            {hasUnreadMessages && <div className="w-3 h-3 rounded-full absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-indigo-500" />}
          </Button>
        </DialogTrigger>
        <DialogContent className="[--messages-dialog-height:70vh] max-w-2xl p-0 max-h-[var(--messages-dialog-height)]">
          {channel ? (
            <Chat channel={channel} user={user} dialog />
          ) : (
            <div>
              <DialogHeader className="p-6 pb-4">
                <DialogTitle>Message Anonymously</DialogTitle>
                <DialogDescription>Ask a question or send a message to someone anonymously.</DialogDescription>
              </DialogHeader>
              <div className="p-6">
                <Button
                  onClick={() => {
                    createChannel();
                  }}
                  disabled={isPending}
                >
                  {isPending ? <Loader2 className="w-4 h-4 mr-2" /> : <MessagesSquare className="w-4 h-4 mr-2" />}
                  Message Anonymously
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    )
  );
}
