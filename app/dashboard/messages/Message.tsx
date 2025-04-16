import { Doc } from '@/convex/_generated/dataModel';
import { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from 'convex/react';
import { EllipsisVertical } from 'lucide-react';

import { api } from '@/convex/_generated/api';
import { useMe } from '@/hooks/use-me';
import { GetUser } from '@/lib/queries/user';
import { formatTime } from '@/lib/utils';
import { getSender } from './actions';

import { MessageSkeleton } from '@/components/messages/ChatSkeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';

type Props = {
  message: Doc<'messages'>;
  channel: Doc<'channels'>;
};

function userCanDelete(channel: Doc<'channels'>, me: GetUser, sender?: User | string) {
  const hasSender = sender && typeof sender !== 'string';
  if (hasSender && sender.id === me?.id) {
    return true;
  }
  switch (channel.type) {
    case 'family':
      return me.managing.some((family) => family.id === channel.family);
    case 'event':
      return me.createdEvents.some((event) => event.id === channel.event);
  }
}

export default function Message({ message, channel }: Props) {
  const { data: sender, isLoading } = useQuery({ queryKey: ['user', message.sender], queryFn: () => getSender(message.sender) });
  const { data: user, isLoading: meLoading } = useMe();

  const deleteMessage = useMutation(api.messages.deleteMessage);

  if (isLoading) {
    return <MessageSkeleton />;
  }
  const hasSender = sender && typeof sender !== 'string';

  return (
    <>
      <div className="mb-4">
        <div className="flex items-start">
          {hasSender && (
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={sender.image || undefined} alt={sender.name || ''} />
              <AvatarFallback>{sender.name?.[0] || ''}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1">
            {hasSender && <h3 className="inline font-semibold h-5">{sender.name}</h3>}
            <p className="inline text-muted-foreground h-5 text-xs ml-1">{formatTime(new Date(message._creationTime))}</p>
            <div className="text-sm">{message.text}</div>
          </div>
          {user && userCanDelete(channel, user, sender) && (
            <Menubar className="border-none shadow-none">
              <MenubarMenu>
                <MenubarTrigger className="cursor-pointer">
                  <EllipsisVertical size={16} />
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={() => deleteMessage({ message: message._id })}>Delete</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          )}
        </div>
      </div>
    </>
  );
}
