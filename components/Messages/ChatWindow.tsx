import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { format, isSameDay } from 'date-fns';
import { EllipsisVertical, Send } from 'lucide-react';
import { Fragment } from 'react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '../ui/menubar';
import { useMe } from '@/app/dashboard/Providers';

import { GetChannelReturnType } from '@/lib/queries/chat';
import { FamilyMemberWithUserAssignments } from '@/prisma/types';

export const userCanDelete = (
  channel: GetChannelReturnType,
  sender: GetChannelReturnType['messages'][0]['sender'],
  user: FamilyMemberWithUserAssignments,
) => {
  if (sender.id === user.id) {
    return true;
  }
  switch (channel.type) {
    case 'family':
      return user.managing.some((family) => family.id === channel.familyId);
    case 'event':
      return user.managing.some((event) => event.id === channel.eventId);
    case 'individual':
      return true;
  }
};

type ChatWindowProps = {
  channel: GetChannelReturnType;
  messages: GetChannelReturnType['messages'];
  handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete: (message: GetChannelReturnType['messages'][0]) => void;
  sidebar: boolean;
};

export default function ChatWindow({ channel, handleSendMessage, messages, sidebar, onDelete }: ChatWindowProps) {
  const { data: me } = useMe();

  if (!me) {
    return 'Loading...';
  }
  return (
    <div className="flex-1 flex flex-col">
      {channel ? (
        <>
          <Card className="flex-1 flex flex-col">
            <CardHeader className="p-4">
              <CardTitle>{channel.name}</CardTitle>
              <CardDescription>
                {channel.type === 'family' && 'Family Thread'}
                {channel.type === 'event' && 'Event Thread'}
                {channel.type === 'individual' && 'Private Message'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-4 pt-0">
              <ScrollArea className="h-full">
                {messages.map((message, index) => {
                  const { id, sender, text, createdAt } = message;
                  const lastMessageDate = messages[index - 1]?.createdAt || new Date();
                  console.log(index);
                  console.log(
                    sender.managing.some((c) => {
                      console.log(c.id, channel.id);
                      return c.id === channel.id;
                    }),
                  );
                  return (
                    <Fragment key={id}>
                      {!isSameDay(lastMessageDate, createdAt) && (
                        <>
                          {index > 0 && <Separator className="my-4" />}
                          <p className="text-center text-xs text-muted-foreground mb-4">{format(createdAt, 'MMM dd, yyyy')}</p>
                        </>
                      )}
                      <div className="mb-4">
                        <div className="flex items-start">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={sender.user?.image || undefined} alt={sender.name} />
                            <AvatarFallback>{sender.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="inline font-semibold h-5">{sender.name}</h3>
                            <p className="inline text-muted-foreground h-5 text-xs ml-1">{format(createdAt, 'h:mm a').toLowerCase()}</p>
                            <div className="text-sm">{text}</div>
                          </div>
                          {userCanDelete(channel, sender, me) && (
                            <Menubar>
                              <MenubarMenu>
                                <MenubarTrigger className="cursor-pointer">
                                  <EllipsisVertical size={16} />
                                </MenubarTrigger>
                                <MenubarContent>
                                  <MenubarItem onClick={() => onDelete(message)}>Delete</MenubarItem>
                                </MenubarContent>
                              </MenubarMenu>
                            </Menubar>
                          )}
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
              </ScrollArea>
            </CardContent>
            <Separator />
            <CardFooter className="p-4">
              <form onSubmit={handleSendMessage} className="flex w-full">
                <Input name="message" placeholder="Type a message..." className="flex-1 mr-2" />
                <Button type="submit" size={sidebar ? 'icon' : 'default'}>
                  <Send className={cn('h-4 w-4', { 'mr-2': !sidebar })} />
                  {sidebar ? '' : 'Send'}
                </Button>
              </form>
            </CardFooter>
          </Card>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">No messages here yet!</div>
      )}
    </div>
  );
}
